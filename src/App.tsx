import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, DiscordUser, ViewMode } from './types';
import { INITIAL_CHARACTERS } from './data/initialCharacters';
import {
  subscribeCharacters,
  seedInitialCharactersIfEmpty,
  saveCharacterToDb,
  deleteCharacterFromDb,
  resetDatabaseToInitial,
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { CharacterFormModal } from './components/CharacterFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DiscordModal } from './components/DiscordModal';
import { RankingTable } from './components/RankingTable';
import { FeatureList } from './components/FeatureList';
import { DeploymentGuide } from './components/DeploymentGuide';
import { parsePowerLevel } from './utils/powerLevel';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Shield,
  Swords,
  Users,
  Lock,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'itachi_characters_v2';
const DISCORD_USER_KEY = 'itachi_discord_user_v2';

export default function App() {
  // キャラクターデータ状態 (localStorage 永続化)
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load characters from localStorage', e);
    }
    return INITIAL_CHARACTERS;
  });

  // Discordログイン状態 (初期状態はログアウト状態null)
  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(() => {
    try {
      const saved = localStorage.getItem(DISCORD_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // デモ用のアカウントが残っている場合はクリアして null にする
        if (parsed && parsed.id && !parsed.id.startsWith('discord-demo')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load user', e);
    }
    return null;
  });

  // 環境変数未設定エラー状態
  const [envError, setEnvError] = useState(false);

  // 表示モード ('catalog' | 'ranking' | 'features' | 'guide')
  const [currentView, setCurrentView] = useState<ViewMode>('catalog');

  // フィルター & ソート状態
  const [searchQuery, setSearchQuery] = useState('');
  const [alignmentFilter, setAlignmentFilter] = useState<'all' | 'ally' | 'enemy'>('all');
  const [sortBy, setSortBy] = useState<'power' | 'name' | 'rank'>('power');

  // モーダル状態
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);

  // URLのクエリパラメータチェック（Cloudflare環境変数未設定時のエラーハンドリング）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'discord_env_missing') {
      setEnvError(true);
      setIsDiscordModalOpen(true);
      // URLからクエリパラメータをきれいに削除
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Firestore リアルタイム同期 & 初期データシード
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    seedInitialCharactersIfEmpty(INITIAL_CHARACTERS).then(() => {
      unsubscribe = subscribeCharacters((updatedChars) => {
        if (updatedChars && updatedChars.length > 0) {
          setCharacters(updatedChars);
        }
      });
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // キャラデータローカル保存バックアップ
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
    } catch (e) {
      console.error('Failed to save characters', e);
    }
  }, [characters]);

  // ユーザー状態保存
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(DISCORD_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(DISCORD_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [currentUser]);

  // Cloudflare Pages 本番環境でのセッション同期チェック (/api/auth/me)
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
          } else {
            setCurrentUser(null);
          }
        }
      } catch {
        // AI Studioローカル環境など/apiがない場合はエラー無視
      }
    }
    checkSession();
  }, []);

  // 権限判定: ユーザーがログインしており、かつ特定のサーバーに参加しているか
  const isAuthorized = !!(currentUser && currentUser.inTargetServer);

  // キャラ新規作成 / 編集の保存処理（Firestore同期）
  const handleSaveCharacter = async (
    data: Omit<Character, 'id' | 'createdAt'>,
    editId?: string
  ) => {
    if (!isAuthorized) {
      setIsDiscordModalOpen(true);
      return;
    }

    if (editId) {
      // 編集更新
      const targetChar = characters.find((c) => c.id === editId);
      if (targetChar) {
        const updatedChar: Character = {
          ...targetChar,
          ...data,
        };
        setCharacters((prev) =>
          prev.map((c) => (c.id === editId ? updatedChar : c))
        );
        try {
          await saveCharacterToDb(updatedChar);
        } catch (err) {
          console.error('Failed to update character in Firestore:', err);
        }
      }
    } else {
      // 新規作成
      const newChar: Character = {
        ...data,
        id: `custom-${Date.now()}`,
        createdAt: Date.now(),
        isCustom: true,
      };
      setCharacters((prev) => [newChar, ...prev]);
      try {
        await saveCharacterToDb(newChar);
      } catch (err) {
        console.error('Failed to create character in Firestore:', err);
      }
    }
  };

  // キャラ削除処理（Firestore同期）
  const handleConfirmDelete = async (id: string) => {
    if (!isAuthorized) {
      setIsDiscordModalOpen(true);
      return;
    }
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteCharacterFromDb(id);
    } catch (err) {
      console.error('Failed to delete character from Firestore:', err);
    }
  };

  // 初期データにリセット（Firestore同期）
  const handleResetData = async () => {
    if (window.confirm('初期キャラクターデータ（20体）にリセットしますか？')) {
      setCharacters(INITIAL_CHARACTERS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      try {
        await resetDatabaseToInitial(INITIAL_CHARACTERS);
      } catch (err) {
        console.error('Failed to reset Firestore database:', err);
      }
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    setCurrentUser(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  // フィルタリングとソート適用後のキャラリスト
  const filteredCharacters = characters.filter((c) => {
    // 陣営フィルター
    if (alignmentFilter === 'ally' && c.alignment !== 'ally') return false;
    if (alignmentFilter === 'enemy' && c.alignment !== 'enemy') return false;

    // 検索クエリ
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.rank.toLowerCase().includes(query) ||
      c.powerLevel.toLowerCase().includes(query) ||
      (c.catchphrase && c.catchphrase.toLowerCase().includes(query)) ||
      c.features.some((f) => f.toLowerCase().includes(query))
    );
  });

  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    if (sortBy === 'power') {
      const pA = parsePowerLevel(a.powerLevel);
      const pB = parsePowerLevel(b.powerLevel);
      if (pA.isInfinite && !pB.isInfinite) return -1;
      if (!pA.isInfinite && pB.isInfinite) return 1;
      return pB.numericValue - pA.numericValue;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name, 'ja');
    }
    if (sortBy === 'rank') {
      return a.rank.localeCompare(b.rank);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ナビゲーションバー */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        currentUser={currentUser}
        onOpenDiscordModal={() => setIsDiscordModalOpen(true)}
        onOpenCreateModal={() => {
          if (!isAuthorized) {
            setIsDiscordModalOpen(true);
          } else {
            setEditingCharacter(null);
            setIsFormModalOpen(true);
          }
        }}
        totalCharactersCount={characters.length}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ヒーローヘッダー */}
        <section className="mb-8 text-center sm:text-left relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#16161A] p-6 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> OFFICIAL DATABASE
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
                イタチイタ戦隊 出演キャラクター図鑑
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                イタチイタ戦隊に登場する味方・敵キャラクターの全ステータス、戦闘力ランキング、作中設定をインタラクティブに確認できます。
              </p>
            </div>

            {/* 権限状態バッジ & リセットボタン */}
            <div className="z-10 flex flex-wrap items-center gap-2 shrink-0">
              {!isAuthorized && (
                <button
                  onClick={() => setIsDiscordModalOpen(true)}
                  className="px-3 py-2 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-900/40 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>作成/編集にはDiscordログイン＆特定サーバー参加が必要</span>
                </button>
              )}

              <button
                onClick={handleResetData}
                className="p-2.5 bg-[#0A0A0B] hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors"
                title="初期データにリセット"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* オーラデコレーション */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* スタッツダッシュボード */}
        <HeroStats
          characters={characters}
          onFilterAlignment={setAlignmentFilter}
          activeFilter={alignmentFilter}
        />

        {/* タブコンテンツレンダリング */}
        {currentView === 'catalog' && (
          <div className="space-y-6">
            
            {/* 検索・フィルター・ソートバー */}
            <div className="bg-[#16161A] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* 検索入力 */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="キャラクター名、セリフ、特徴で検索..."
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* 陣営フィルターボタン */}
              <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setAlignmentFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    alignmentFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setAlignmentFilter('ally')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    alignmentFilter === 'ally'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" /> 味方
                </button>
                <button
                  onClick={() => setAlignmentFilter('enemy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    alignmentFilter === 'enemy'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Swords className="w-3 h-3" /> 敵
                </button>
              </div>

              {/* ソートセレクター */}
              <div className="flex items-center gap-2 bg-[#0A0A0B] px-3 py-1.5 rounded-xl border border-white/5 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 font-semibold hidden sm:inline">並び替え:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="power" className="bg-[#16161A]">戦闘力順</option>
                  <option value="name" className="bg-[#16161A]">名前順</option>
                  <option value="rank" className="bg-[#16161A]">ランク順</option>
                </select>
              </div>

            </div>

            {/* キャラクターカードグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {sortedCharacters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    isAuthorized={isAuthorized}
                    onSelect={(c) => setSelectedCharacter(c)}
                    onEdit={(c) => {
                      setEditingCharacter(c);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={(c) => {
                      setDeletingCharacter(c);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {sortedCharacters.length === 0 && (
              <div className="bg-[#16161A] p-12 text-center rounded-3xl border border-white/5 space-y-3">
                <Users className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="text-base font-bold text-gray-300">
                  該当するキャラクターが見つかりません
                </h3>
                <p className="text-xs text-gray-500">
                  検索条件を変更するか、右上の「キャラ新規作成」から追加してください。
                </p>
              </div>
            )}
          </div>
        )}

        {/* ランキング表ビュー */}
        {currentView === 'ranking' && (
          <RankingTable
            characters={characters}
            onSelectCharacter={(c) => setSelectedCharacter(c)}
          />
        )}

        {/* 特徴一覧ビュー */}
        {currentView === 'features' && (
          <FeatureList
            characters={characters}
            onSelectCharacter={(c) => setSelectedCharacter(c)}
          />
        )}

        {/* 公開設定ガイドビュー */}
        {currentView === 'guide' && <DeploymentGuide />}

      </main>

      {/* フッター */}
      <footer className="border-t border-white/5 bg-[#0F0F12] py-8 text-center text-xs text-gray-500 space-y-2">
        <p className="font-semibold text-gray-400">
          イタチイタ戦隊 公式キャラクターデータベース © 2026
        </p>
        <p className="max-w-xl mx-auto px-4 text-[11px] text-gray-500">
          Vite + React + Tailwind CSS + Motion による超高速・レスポンシブWebアプリケーション。GitHub Pages / Cloudflare Pages 対応。
        </p>
      </footer>

      {/* 各種モーダル */}
      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />

      <CharacterFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCharacter}
        editingCharacter={editingCharacter}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        character={deletingCharacter}
      />

      <DiscordModal
        isOpen={isDiscordModalOpen}
        onClose={() => {
          setIsDiscordModalOpen(false);
          setEnvError(false);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        envError={envError}
      />

    </div>
  );
}
