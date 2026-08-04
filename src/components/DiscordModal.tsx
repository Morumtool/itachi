import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiscordUser } from '../types';
import { X, CheckCircle2, ShieldAlert, LogOut, Disc as DiscordIcon, ExternalLink, AlertTriangle } from 'lucide-react';

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DiscordUser | null;
  onLogout: () => void;
  envError?: boolean;
}

export const DiscordModal: React.FC<DiscordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  envError = false,
}) => {
  if (!isOpen) return null;

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
                <p className="text-xs text-gray-400 font-mono">DISCORD AUTHENTICATION</p>
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
                          ? 'キャラクターの新規作成・編集・削除権限が有効化されています。'
                          : 'キャラクターの作成・編集・削除には指定のDiscordサーバーへの参加が必要です。'}
                      </p>
                    </div>
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
              /* ログアウト中表示 */
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  指定のDiscordサーバーに参加しているアカウントでログインすると、キャラクターの新規作成・編集・削除が利用可能になります。
                </p>

                {/* 環境変数未設定時の通知警告ボックス */}
                {envError && (
                  <div className="bg-rose-950/50 border border-rose-500/40 rounded-xl p-4 text-xs text-rose-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      Cloudflare Pages 環境変数が未設定です
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-300/90">
                      Cloudflare ダッシュボードの Pages プロジェクト [Settings] → [Variables and secrets] にて、以下の環境変数を追加してください：
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-mono text-[10px] text-rose-200 bg-black/40 p-2.5 rounded-lg border border-rose-500/20">
                      <li>DISCORD_CLIENT_ID</li>
                      <li>DISCORD_CLIENT_SECRET</li>
                      <li>DISCORD_REDIRECT_URI</li>
                      <li>DISCORD_GUILD_ID</li>
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <a
                    href="/api/auth/discord/login"
                    className="w-full py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 block text-center"
                  >
                    <DiscordIcon className="w-5 h-5" /> Discordアカウントでログイン
                  </a>
                </div>

                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3 text-[11px] text-indigo-300 leading-relaxed flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    クリックするとDiscordの公式OAuth2認証画面へ移動します。
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
