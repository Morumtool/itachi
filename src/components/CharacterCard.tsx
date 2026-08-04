import React from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';
import { PowerBar } from './PowerBar';
import { getRankBadgeColor } from '../utils/powerLevel';
import { Edit2, Trash2, Lock, Shield, Swords, Info } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  isAuthorized: boolean;
  onSelect: (char: Character) => void;
  onEdit: (char: Character) => void;
  onDelete: (char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isAuthorized,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const rankColors = getRankBadgeColor(character.rank);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-[#16161A] border border-white/5 hover:border-indigo-500/40 hover:bg-[#1C1C22] rounded-2xl p-4 shadow-xl hover:shadow-indigo-950/30 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
    >
      {/* 背景アクセントグラデーション */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-10 transition-opacity group-hover:opacity-30 ${
          character.alignment === 'ally'
            ? 'bg-cyan-500'
            : 'bg-rose-500'
        }`}
      />

      {/* カードヘッダー */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          {/* アバター & 名前 */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#0A0A0B] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-indigo-500/50 transition-colors">
              {character.iconType === 'emoji' ? (
                <span className="text-2xl select-none">{character.iconValue}</span>
              ) : (
                <img
                  src={character.iconValue}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // フォールバック
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                {/* 陣営バッジ */}
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-0.5 ${
                    character.alignment === 'ally'
                      ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30'
                      : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {character.alignment === 'ally' ? (
                    <>
                      <Shield className="w-2.5 h-2.5" /> 味方
                    </>
                  ) : (
                    <>
                      <Swords className="w-2.5 h-2.5" /> 敵
                    </>
                  )}
                </span>

                {/* ランクバッジ */}
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${rankColors.bg} ${rankColors.text} ${rankColors.border} ${rankColors.glow || ''}`}
                >
                  {character.rank}
                </span>
              </div>

              <h3 className="font-extrabold text-white text-base tracking-tight truncate group-hover:text-indigo-300 transition-colors">
                {character.name}
              </h3>
            </div>
          </div>

          {/* 編集・削除ボタン（特定サーバー参加権限が必要） */}
          <div className="flex items-center gap-1 shrink-0">
            {isAuthorized ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(character);
                  }}
                  className="p-1.5 text-gray-400 hover:text-indigo-300 hover:bg-white/10 rounded-lg transition-colors"
                  title="キャラ編集"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(character);
                  }}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                  title="キャラ削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div
                className="p-1.5 text-gray-600 cursor-not-allowed flex items-center gap-1"
                title="編集・削除には特定Discordサーバーへの参加が必要です"
              >
                <Lock className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* 応答ステータス */}
        <div className="mb-3 flex items-center justify-between text-xs bg-[#0A0A0B] rounded-lg px-2.5 py-1.5 border border-white/5">
          <span className="text-gray-400 font-mono text-[10px] uppercase font-bold">STATUS</span>
          <span className="font-semibold text-gray-200">{character.status}</span>
        </div>

        {/* 特徴抜粋 */}
        {character.features.length > 0 && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed min-h-[36px]">
            {character.features[0]}
          </p>
        )}
      </div>

      {/* フッター: 戦闘力プログレスバー & 詳細オープン */}
      <div className="pt-2 border-t border-white/5 space-y-3">
        <PowerBar powerLevel={character.powerLevel} height="sm" />

        <button
          onClick={() => onSelect(character)}
          className="w-full py-2 px-3 bg-white/5 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group-hover:shadow-md border border-white/5 hover:border-indigo-500/30"
        >
          <Info className="w-3.5 h-3.5" />
          <span>プロフィール詳細を表示</span>
        </button>
      </div>
    </motion.div>
  );
};
