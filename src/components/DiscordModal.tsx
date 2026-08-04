import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiscordUser } from '../types';
import { X, CheckCircle2, ShieldAlert, LogOut, Disc as DiscordIcon, ShieldCheck } from 'lucide-react';

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DiscordUser | null;
  onLogin: (user: DiscordUser) => void;
  onLogout: () => void;
  onToggleServer: (inServer: boolean) => void;
}

export const DiscordModal: React.FC<DiscordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onToggleServer,
}) => {
  const [usernameInput, setUsernameInput] = useState('ItachiHero_99');

  if (!isOpen) return null;

  const handleSimulateLogin = (inServer: boolean) => {
    const mockUser: DiscordUser = {
      id: `discord-${Date.now()}`,
      username: usernameInput || 'ItachiHero',
      globalName: usernameInput || 'イタチイタ隊員',
      avatar: '🥷',
      inTargetServer: inServer,
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#16161A] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-gray-100 relative"
        >
          {/* モーダルヘッダー */}
          <div className="bg-[#0F0F12] p-5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                <DiscordIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Discord 連携認証</h3>
                <p className="text-xs text-gray-400 font-mono">OFFICIAL DISCORD AUTHENTICATION</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* モーダルボディ */}
          <div className="p-6 space-y-6">
            {currentUser ? (
              /* ログイン中表示 */
              <div className="space-y-5">
                <div className="bg-[#0A0A0B] rounded-xl p-4 border border-white/10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#5865F2]/30 border-2 border-[#5865F2] flex items-center justify-center text-2xl shadow-lg">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">AUTHENTICATED USER</div>
                    <div className="font-bold text-lg text-white truncate">
                      {currentUser.globalName}
                    </div>
                    <div className="text-xs text-indigo-400 font-mono">@{currentUser.username}</div>
                  </div>
                </div>

                {/* サーバー参加状態 */}
                <div className={`p-4 rounded-xl border ${
                  currentUser.inTargetServer
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                }`}>
                  <div className="flex items-start gap-3">
                    {currentUser.inTargetServer ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <div className="font-bold mb-1">
                        {currentUser.inTargetServer
                          ? '特定Discordサーバー参加確認済み'
                          : '特定Discordサーバー未参加'}
                      </div>
                      <p className="text-xs opacity-90 leading-relaxed">
                        {currentUser.inTargetServer
                          ? 'キャラの新規作成、編集、削除権限が有効化されています。'
                          : 'キャラの作成・編集・削除には特定Discordサーバーへの参加が必要です。'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* サーバー参加トグル切替 */}
                <div className="pt-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-2">
                    デモ用: サーバー参加ステータス切替
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onToggleServer(true)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        currentUser.inTargetServer
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                          : 'bg-[#0A0A0B] text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" /> サーバー参加中
                    </button>
                    <button
                      onClick={() => onToggleServer(false)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        !currentUser.inTargetServer
                          ? 'bg-amber-600 text-white border-amber-400 shadow-lg'
                          : 'bg-[#0A0A0B] text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" /> 未参加状態
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="flex-1 py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> ログアウト
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl font-bold text-sm transition-all"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            ) : (
              /* ログイン前表示 */
              <div className="space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  「イタチイタ戦隊」特定のDiscordサーバーに参加しているアカウントで連携すると、キャラクターの新規作成・編集・削除ができるようになります。
                </p>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1.5">
                    DISCORD USERNAME
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="ユーザー名を入力"
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 text-xs text-indigo-200 leading-relaxed">
                  💡 <strong>提示:</strong> ログイン後に「特定のサーバーに参加している状態」で認証をシミュレーションできます。
                </div>

                <div className="space-y-2 pt-2">
                  {/* 本番環境 (Cloudflare Pages) 用 OAuth リアルログイン */}
                  <a
                    href="/api/auth/discord/login"
                    className="w-full py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 block text-center"
                  >
                    <DiscordIcon className="w-5 h-5" /> Discordアカウントで本番OAuth連携
                  </a>

                  {/* デモ用シミュレーションログインボタン */}
                  <button
                    onClick={() => handleSimulateLogin(true)}
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2"
                  >
                    【デモ用】特定サーバー参加済として簡易ログイン
                  </button>
                  <button
                    onClick={() => handleSimulateLogin(false)}
                    className="w-full py-2 px-4 bg-black/20 hover:bg-black/40 text-gray-400 rounded-xl font-medium text-[11px] transition-all flex items-center justify-center gap-2"
                  >
                    【デモ用】未参加状態として簡易ログイン
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
