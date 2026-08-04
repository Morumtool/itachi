import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { PowerBar } from './PowerBar';
import { getRankBadgeColor } from '../utils/powerLevel';
import {
  X,
  Shield,
  Swords,
  Sparkles,
  MessageSquareQuote,
  Utensils,
  Flame,
  User,
} from 'lucide-react';

interface CharacterModalProps {
  character: Character | null;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  onClose,
}) => {
  if (!character) return null;

  const rankColors = getRankBadgeColor(character.rank);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#16161A] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-gray-100 relative my-auto"
        >
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center border border-white/10 transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ヘッダーカードカバー */}
          <div
            className={`relative p-6 sm:p-8 ${
              character.alignment === 'ally'
                ? 'bg-gradient-to-br from-cyan-950/60 via-[#16161A] to-[#16161A] border-b border-cyan-500/30'
                : 'bg-gradient-to-br from-rose-950/60 via-[#16161A] to-[#16161A] border-b border-rose-500/30'
            }`}
          >
            {/* オーラライト */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
                character.alignment === 'ally' ? 'bg-cyan-500' : 'bg-rose-500'
              }`}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* 大判アバター */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#0A0A0B] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shrink-0">
                {character.iconType === 'emoji' ? (
                  <span className="text-6xl sm:text-7xl select-none animate-bounce-slow">
                    {character.iconValue}
                  </span>
                ) : (
                  <img
                    src={character.iconValue}
                    alt={character.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* 名前・属性・ランク */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border flex items-center gap-1 ${
                      character.alignment === 'ally'
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {character.alignment === 'ally' ? (
                      <>
                        <Shield className="w-3.5 h-3.5" /> 味方陣営
                      </>
                    ) : (
                      <>
                        <Swords className="w-3.5 h-3.5" /> 敵陣営
                      </>
                    )}
                  </span>

                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-lg border font-bold ${rankColors.bg} ${rankColors.text} ${rankColors.border} ${rankColors.glow || ''}`}
                  >
                    RANK {character.rank}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                  {character.name}
                </h2>

                {/* 戦闘力バー */}
                <div className="bg-[#0A0A0B] p-3 rounded-xl border border-white/5">
                  <PowerBar powerLevel={character.powerLevel} height="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* プロフィール詳細スペック */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* ステータスグリッド (一人称・口癖・好物・必殺技) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {character.firstPerson && (
                <div className="bg-[#0A0A0B] p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">一人称</div>
                    <div className="font-bold text-sm text-gray-100">{character.firstPerson}</div>
                  </div>
                </div>
              )}

              {character.catchphrase && (
                <div className="bg-[#0A0A0B] p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">名言 / 口癖</div>
                    <div className="font-bold text-sm text-amber-300">「{character.catchphrase}」</div>
                  </div>
                </div>
              )}

              {character.favoriteFood && (
                <div className="bg-[#0A0A0B] p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">好物</div>
                    <div className="font-bold text-sm text-gray-100">{character.favoriteFood}</div>
                  </div>
                </div>
              )}

              {character.specialMove && (
                <div className="bg-[#0A0A0B] p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">必殺技</div>
                    <div className="font-bold text-sm text-rose-300">{character.specialMove}</div>
                  </div>
                </div>
              )}

            </div>

            {/* 特徴・詳細解説 */}
            <div className="bg-[#0A0A0B] p-5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-indigo-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> キャラクター解説・特徴
              </h4>
              <ul className="space-y-2.5">
                {character.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-200 leading-relaxed flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">・</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 閉じるボタン */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl font-bold text-sm transition-all border border-white/10"
              >
                閉じる
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
