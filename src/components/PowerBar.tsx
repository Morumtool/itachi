import React from 'react';
import { motion } from 'motion/react';
import { parsePowerLevel } from '../utils/powerLevel';
import { Infinity } from 'lucide-react';

interface PowerBarProps {
  powerLevel: string;
  showText?: boolean;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

export const PowerBar: React.FC<PowerBarProps> = ({
  powerLevel,
  showText = true,
  className = '',
  height = 'md',
}) => {
  const parsed = parsePowerLevel(powerLevel);
  const { numericValue, isInfinite, displayRankPercentage } = parsed;

  const barHeight = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  }[height];

  // 基礎バーの割合（95→∞ の場合は 95%）
  const basePercent = isInfinite ? Math.min(numericValue, 95) : Math.min(numericValue, 100);

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1 text-xs font-mono font-semibold">
          <span className="text-zinc-400">POWER LEVEL</span>
          <span className="flex items-center gap-1">
            {isInfinite ? (
              <span className="inline-flex items-center gap-0.5 text-amber-400 font-extrabold tracking-wider animate-pulse">
                <span>{numericValue}</span>
                <span className="text-rose-400">→</span>
                <Infinity className="w-4 h-4 text-amber-300 inline animate-spin-slow" />
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent ml-0.5 text-xs">
                  [LIMIT BREAK]
                </span>
              </span>
            ) : (
              <span className="text-cyan-400 font-bold text-sm tracking-wide">
                {powerLevel}
              </span>
            )}
          </span>
        </div>
      )}

      {/* バーの外枠トラック */}
      <div className={`w-full bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/60 relative ${barHeight} shadow-inner`}>
        {/* 背景グリッドライン模様 */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:8px_100%] z-0 pointer-events-none" />

        {/* メインゲージ */}
        <div className="relative w-full h-full flex z-10">
          {/* ベース数値分のバー */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${basePercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${
              isInfinite
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
            } relative overflow-hidden`}
          >
            {/* バー上の光グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
          </motion.div>

          {/* 無限突破時の追加ゲージ（95%から100%の区間） */}
          {isInfinite && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: `${100 - basePercent}%`, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 relative overflow-hidden flex-1"
            >
              {/* ギラギラ輝くアニメーションオーバーレイ */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
