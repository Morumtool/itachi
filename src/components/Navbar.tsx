import React from 'react';
import { DiscordUser, ViewMode } from '../types';
import { UserAvatar } from './UserAvatar';
import {
  Disc as DiscordIcon,
  PlusCircle,
  Trophy,
  Users,
  Sparkles,
  BookOpen,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Database,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  currentUser: DiscordUser | null;
  onOpenDiscordModal: () => void;
  onOpenCreateModal: () => void;
  onOpenBackupModal: () => void;
  totalCharactersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onOpenDiscordModal,
  onOpenCreateModal,
  onOpenBackupModal,
  totalCharactersCount,
}) => {
  const isAuthorized = currentUser && currentUser.inTargetServer;


  return (
    <header className="sticky top-0 z-40 bg-[#0F0F12]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* ロゴ・アプリタイトル */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onSelectView('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-rose-500 p-0.5 shadow-lg shadow-indigo-950/40 shrink-0">
              <div className="w-full h-full bg-[#0A0A0B] rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 text-lg">
                イ
              </div>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">
                    イタチイタ戦隊
                  </span>
                  <span className="hidden md:inline text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
                    ARCHIVE
                  </span>
                </h1>
              </div>
              <p className="text-[10px] font-mono text-gray-400 hidden sm:block whitespace-nowrap">
                TOTAL: <span className="text-white font-bold">{totalCharactersCount}</span> UNITS | COMBAT ARCHIVE
              </p>
            </div>
          </div>

          {/* ビュー切り替えタブ（デスクトップ） */}
          <nav className="hidden md:flex items-center gap-1 bg-[#16161A] p-1 rounded-xl border border-white/5 shrink-0">
            <button
              onClick={() => onSelectView('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>キャラ図鑑</span>
            </button>

            <button
              onClick={() => onSelectView('ranking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'ranking'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>ランキング表</span>
            </button>

            <button
              onClick={() => onSelectView('features')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'features'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>特徴一覧</span>
            </button>

            <button
              onClick={() => onSelectView('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'guide'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>公開ガイド</span>
            </button>
          </nav>

          {/* 右上アクションエリア（システムステータス・キャラ作成・ログイン） */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* System Status Display */}
            <div className="hidden xl:flex flex-col items-end mr-1 shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold whitespace-nowrap">SYSTEM STATUS</span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                <span className="text-xs font-mono text-emerald-400 font-bold">OPERATIONAL</span>
              </div>
            </div>

            <div className="hidden xl:block h-7 w-[1px] bg-white/10 mx-1"></div>

            {/* Firestoreバックアップボタン */}
            <button
              onClick={onOpenBackupModal}
              className={`py-2 px-3 sm:px-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
                isAuthorized
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-amber-950/20 hover:bg-amber-950/40 text-amber-400/80 border-amber-500/20'
              }`}
              title={
                isAuthorized
                  ? 'Cloud Firestoreのバックアップ管理・復元'
                  : 'バックアップの利用にはDiscord「イタチイタ鯖」への参加が必要です'
              }
            >
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">バックアップ</span>
              {!isAuthorized && <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />}
            </button>

            {/* 新規作成ボタン */}

            <button
              onClick={onOpenCreateModal}
              className={`py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border ${
                isAuthorized
                  ? 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20'
                  : 'bg-[#16161A] text-gray-400 border-white/5 hover:bg-white/5 hover:text-gray-200'
              }`}
              title={
                isAuthorized
                  ? '新しいキャラクターを作成'
                  : '作成にはDiscordサーバー「イタチイタ鯖」への参加が必要です'
              }
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">キャラ新規作成</span>
            </button>

            {/* アカウント状態 / Discordログインボタン */}
            {currentUser ? (
              <div className="flex items-center gap-1 bg-[#16161A] border border-white/10 rounded-xl p-1">
                <button
                  onClick={onOpenDiscordModal}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div className="relative">
                    <UserAvatar
                      avatar={currentUser.avatar}
                      name={currentUser.globalName}
                      className="w-7 h-7 rounded-lg border border-indigo-500/40"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0F0F12] ${
                        currentUser.inTargetServer ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <div className="text-xs font-bold text-white max-w-[100px] truncate">
                      {currentUser.globalName}
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      {currentUser.inTargetServer ? (
                        <span className="text-emerald-400 flex items-center">
                          <ShieldCheck className="w-3 h-3 inline mr-0.5" /> 参加中
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center">
                          <ShieldAlert className="w-3 h-3 inline mr-0.5" /> 未参加
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenDiscordModal}
                className="py-2 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-950/50 border border-indigo-400/20"
              >
                <DiscordIcon className="w-4 h-4" />
                <span>Discordでログイン</span>
              </button>
            )}

          </div>
        </div>

        {/* モバイル用ナビゲーションタブ */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-white/5 text-xs">
          <button
            onClick={() => onSelectView('catalog')}
            className={`py-1 px-2 rounded-lg font-bold flex items-center gap-1 ${
              currentView === 'catalog' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 図鑑
          </button>
          <button
            onClick={() => onSelectView('ranking')}
            className={`py-1 px-2 rounded-lg font-bold flex items-center gap-1 ${
              currentView === 'ranking' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> ランキング
          </button>
          <button
            onClick={() => onSelectView('features')}
            className={`py-1 px-2 rounded-lg font-bold flex items-center gap-1 ${
              currentView === 'features' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 特徴
          </button>
          <button
            onClick={() => onSelectView('guide')}
            className={`py-1 px-2 rounded-lg font-bold flex items-center gap-1 ${
              currentView === 'guide' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> ガイド
          </button>
        </div>
      </div>
    </header>
  );
};
