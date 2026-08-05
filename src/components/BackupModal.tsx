import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileJson,
  Plus,
} from 'lucide-react';
import { Character, FirestoreBackup } from '../types';
import {
  createFirestoreBackup,
  getFirestoreBackups,
  restoreFirestoreBackup,
  deleteFirestoreBackup,
} from '../lib/firebase';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCharacterCount: number;
  characters: Character[];
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  currentCharacterCount,
  characters,
}) => {
  const [backups, setBackups] = useState<FirestoreBackup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const data = await getFirestoreBackups();
      setBackups(data);
    } catch (err) {
      console.error('Failed to fetch backups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBackups();
      setStatusMessage(null);
    }
  }, [isOpen]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Cloud Firestoreへバックアップを作成
  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      await createFirestoreBackup(noteInput.trim() || '手動バックアップ');
      setNoteInput('');
      showMessage('success', 'Cloud Firestore にバックアップを保存しました！');
      await fetchBackups();
    } catch (err) {
      console.error('Backup creation failed:', err);
      showMessage('error', 'バックアップの作成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // バックアップから復元
  const handleRestore = async (backup: FirestoreBackup) => {
    if (!window.confirm(`「${backup.note || 'バックアップ'}」 (${backup.count}体) からデータを復元しますか？現在のデータは置き換わります。`)) {
      return;
    }
    setIsLoading(true);
    try {
      await restoreFirestoreBackup(backup);
      showMessage('success', 'Cloud Firestoreのデータを復元しました！');
    } catch (err) {
      console.error('Restore failed:', err);
      showMessage('error', 'データの復元に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // バックアップの削除
  const handleDeleteBackup = async (backupId: string) => {
    if (!window.confirm('このバックアップ記録を削除してもよろしいですか？')) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteFirestoreBackup(backupId);
      showMessage('success', 'バックアップを削除しました。');
      await fetchBackups();
    } catch (err) {
      console.error('Backup deletion failed:', err);
      showMessage('error', 'バックアップの削除に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // JSONファイルとしてダウンロード（ローカルバックアップ）
  const handleExportJson = () => {
    const backupObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      count: characters.length,
      characters,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `itachi_firestore_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showMessage('success', 'JSONファイルをダウンロードしました。');
  };

  // JSONファイルから復元（ファイルアップロード）
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const importedChars: Character[] = json.characters || (Array.isArray(json) ? json : null);
        if (!importedChars || !Array.isArray(importedChars)) {
          throw new Error('無効なJSONフォーマットです');
        }

        if (!window.confirm(`ファイルから ${importedChars.length} 件のキャラクターデータをFirestoreにインポートして復元しますか？`)) {
          return;
        }

        const backupData: FirestoreBackup = {
          id: `imported_${Date.now()}`,
          createdAt: Date.now(),
          note: `ファイル復元 (${file.name})`,
          count: importedChars.length,
          data: importedChars,
        };

        setIsLoading(true);
        await restoreFirestoreBackup(backupData);
        showMessage('success', 'JSONファイルからデータをインポートし復元しました！');
      } catch (err) {
        console.error('Import error:', err);
        showMessage('error', 'JSONファイルの読み込みに失敗しました。フォーマットを確認してください。');
      } finally {
        setIsLoading(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-[#121318] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-[#161822] to-indigo-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Cloud Firestore バックアップ管理
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Cloud 連携中
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  現在の全キャラクターデータ ({currentCharacterCount} 体) の保存とスナップショット復元
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 通知メッセージ */}
          {statusMessage && (
            <div
              className={`px-5 py-3 text-xs font-semibold flex items-center gap-2 border-b ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* メインコンテンツエリア */}
          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
            {/* 新規スナップショット作成 */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> 新規クラウドバックアップを作成
                </h3>
                <span className="text-xs text-gray-400">現在のキャラ数: {currentCharacterCount} 体</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="バックアップのメモ (例: 大規模アップデート前)"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  onClick={handleCreateBackup}
                  disabled={isLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Firestoreに保存</span>
                </button>
              </div>
            </div>

            {/* クラウドバックアップ履歴一覧 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Firestore 保存済みスナップショット ({backups.length})
                </h3>
                <button
                  onClick={fetchBackups}
                  disabled={isLoading}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  更新
                </button>
              </div>

              {backups.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-xs text-gray-500">
                  Firestore上にまだバックアップスナップショットが保存されていません。
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {backups.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-black/30 border border-white/10 rounded-xl flex items-center justify-between hover:border-amber-500/30 transition-all gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {b.note || '手動バックアップ'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20 shrink-0">
                            {b.count} 体
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {new Date(b.createdAt).toLocaleString('ja-JP')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRestore(b)}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> 復元
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(b.id)}
                          disabled={isLoading}
                          className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 rounded-lg transition-colors"
                          title="バックアップを削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ローカルJSONファイル エクスポート / インポート */}
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <FileJson className="w-4 h-4" /> ファイル手動バックアップ (JSON)
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                PCローカルにJSONファイルとしてキャラクターデータを書き出し・読み込みして復元できます。
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" /> JSONでダウンロード
                </button>

                <label className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" /> JSONファイルから復元
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-semibold transition-colors"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
