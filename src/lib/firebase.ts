import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore';
import { Character, FirestoreBackup } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

const CHARACTERS_COLLECTION = 'characters';
const BACKUPS_COLLECTION = 'backups';

/**
 * Realtime subscription to characters collection.
 */

export function subscribeCharacters(
  onUpdate: (characters: Character[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, CHARACTERS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const chars: Character[] = snapshot.docs.map((docSnap) => docSnap.data() as Character);
      onUpdate(chars);
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Seed initial characters into Firestore if the collection is empty,
 * or sync missing local characters to Firestore if any exist.
 */
export async function seedInitialCharactersIfEmpty(initialChars: Character[]): Promise<Character[]> {
  try {
    const colRef = collection(db, CHARACTERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const batch = writeBatch(db);
      initialChars.forEach((char) => {
        const docRef = doc(db, CHARACTERS_COLLECTION, char.id);
        batch.set(docRef, JSON.parse(JSON.stringify(char)));
      });
      await batch.commit();
      return initialChars;
    } else {
      const existingDocs = snapshot.docs.map((docSnap) => docSnap.data() as Character);
      const existingIds = new Set(existingDocs.map((c) => c.id));
      
      // If there are local items (e.g. newly created custom characters) missing in Firestore, sync them
      const missingLocalChars = initialChars.filter((c) => !existingIds.has(c.id));
      if (missingLocalChars.length > 0) {
        const batch = writeBatch(db);
        missingLocalChars.forEach((char) => {
          const docRef = doc(db, CHARACTERS_COLLECTION, char.id);
          batch.set(docRef, JSON.parse(JSON.stringify(char)));
        });
        await batch.commit();
      }

      return existingDocs;
    }
  } catch (err) {
    console.error('Error seeding initial characters to Firestore:', err);
    return initialChars;
  }
}

/**
 * Save (create or update) a character in Firestore.
 */
export async function saveCharacterToDb(character: Character): Promise<void> {
  const docRef = doc(db, CHARACTERS_COLLECTION, character.id);
  // Clean undefined fields before writing to Firestore
  const cleanData = JSON.parse(JSON.stringify(character));
  await setDoc(docRef, cleanData, { merge: true });
}

/**
 * Delete a character from Firestore.
 */
export async function deleteCharacterFromDb(id: string): Promise<void> {
  const docRef = doc(db, CHARACTERS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Create a snapshot backup of current characters collection in Firestore.
 * Characters are saved in subcollection backups/{backupId}/items to prevent exceeding 1MB document size limits.
 */
export async function createFirestoreBackup(note?: string): Promise<FirestoreBackup> {
  const colRef = collection(db, CHARACTERS_COLLECTION);
  const snapshot = await getDocs(colRef);
  const currentChars: Character[] = snapshot.docs.map((docSnap) => docSnap.data() as Character);

  const backupId = `backup_${Date.now()}`;
  const backupMeta = {
    id: backupId,
    createdAt: Date.now(),
    note: note || '手動バックアップ',
    count: currentChars.length,
  };

  // Save metadata document (without large character data array)
  const backupDocRef = doc(db, BACKUPS_COLLECTION, backupId);
  await setDoc(backupDocRef, backupMeta);

  // Save individual character documents into subcollection backups/{backupId}/items
  const BATCH_SIZE = 400;
  for (let i = 0; i < currentChars.length; i += BATCH_SIZE) {
    const chunk = currentChars.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((char) => {
      const itemDocRef = doc(db, BACKUPS_COLLECTION, backupId, 'items', char.id);
      batch.set(itemDocRef, JSON.parse(JSON.stringify(char)));
    });
    await batch.commit();
  }

  return { ...backupMeta, data: currentChars };
}

/**
 * Get all backups stored in Firestore ordered by creation date desc.
 */
export async function getFirestoreBackups(): Promise<FirestoreBackup[]> {
  const colRef = collection(db, BACKUPS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      createdAt: data.createdAt || Date.now(),
      note: data.note || '手動バックアップ',
      count: data.count || 0,
      data: data.data, // Legacy backup data if present
    } as FirestoreBackup;
  });
}

/**
 * Restore characters from a Firestore backup snapshot.
 */
export async function restoreFirestoreBackup(backupData: FirestoreBackup): Promise<void> {
  let charactersToRestore: Character[] = [];

  if (backupData.data && backupData.data.length > 0) {
    // Legacy single document backup format
    charactersToRestore = backupData.data;
  } else {
    // Fetch items from subcollection
    const itemsColRef = collection(db, BACKUPS_COLLECTION, backupData.id, 'items');
    const itemsSnap = await getDocs(itemsColRef);
    charactersToRestore = itemsSnap.docs.map((d) => d.data() as Character);
  }

  // Delete current characters in characters collection
  const charColRef = collection(db, CHARACTERS_COLLECTION);
  const currentSnap = await getDocs(charColRef);

  const BATCH_SIZE = 400;
  const docsToDelete = currentSnap.docs;
  for (let i = 0; i < docsToDelete.length; i += BATCH_SIZE) {
    const chunk = docsToDelete.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }

  // Restore backup characters into characters collection
  for (let i = 0; i < charactersToRestore.length; i += BATCH_SIZE) {
    const chunk = charactersToRestore.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((char) => {
      const docRef = doc(db, CHARACTERS_COLLECTION, char.id);
      batch.set(docRef, JSON.parse(JSON.stringify(char)));
    });
    await batch.commit();
  }
}

/**
 * Delete a backup from Firestore (including subcollection items).
 */
export async function deleteFirestoreBackup(backupId: string): Promise<void> {
  // Delete subcollection items
  const itemsColRef = collection(db, BACKUPS_COLLECTION, backupId, 'items');
  const itemsSnap = await getDocs(itemsColRef);

  const BATCH_SIZE = 400;
  for (let i = 0; i < itemsSnap.docs.length; i += BATCH_SIZE) {
    const chunk = itemsSnap.docs.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }

  // Delete main backup document
  const docRef = doc(db, BACKUPS_COLLECTION, backupId);
  await deleteDoc(docRef);
}

