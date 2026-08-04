import React from 'react';
import { Character } from '../types';
import { Users, Shield, Swords, Zap, Award } from 'lucide-react';
import { parsePowerLevel } from '../utils/powerLevel';

interface HeroStatsProps {
  characters: Character[];
  onFilterAlignment: (alignment: 'all' | 'ally' | 'enemy') => void;
  activeFilter: 'all' | 'ally' | 'enemy';
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  characters,
  onFilterAlignment,
  activeFilter,
}) => {
  const totalCount = characters.length;
  const allyCount = characters.filter((c) => c.alignment === 'ally').length;
  const enemyCount = characters.filter((c) => c.alignment === 'enemy').length;

  // 最高戦闘力キャラの特定
  const topChar = [...characters].sort((a, b) => {
    const pA = parsePowerLevel(a.powerLevel);
    const pB = parsePowerLevel(b.powerLevel);
    if (pA.isInfinite && !pB.isInfinite) return -1;
    if (!pA.isInfinite && pB.isInfinite) return 1;
    return pB.numericValue - pA.numericValue;
  })[0];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      
      {/* 総キャラ数 */}
      <button
        onClick={() => onFilterAlignment('all')}
        className={`p-4 rounded-2xl border text-left transition-all ${
          activeFilter === 'all'
            ? 'bg-[#16161A] border-indigo-500/80 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
            : 'bg-[#16161A] border-white/5 hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold">総キャラクター数</span>
          <Users className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
          {totalCount}
          <span className="text-xs font-semibold text-gray-500 font-mono">UNITS</span>
        </div>
      </button>

      {/* 味方キャラクター */}
      <button
        onClick={() => onFilterAlignment('ally')}
        className={`p-4 rounded-2xl border text-left transition-all ${
          activeFilter === 'ally'
            ? 'bg-[#16161A] border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
            : 'bg-[#16161A] border-white/5 hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold">味方陣営</span>
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-cyan-400 flex items-baseline gap-1">
          {allyCount}
          <span className="text-xs font-semibold text-gray-500 font-mono">UNITS</span>
        </div>
      </button>

      {/* 敵キャラクター */}
      <button
        onClick={() => onFilterAlignment('enemy')}
        className={`p-4 rounded-2xl border text-left transition-all ${
          activeFilter === 'enemy'
            ? 'bg-[#16161A] border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
            : 'bg-[#16161A] border-white/5 hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold">敵陣営</span>
          <Swords className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-rose-400 flex items-baseline gap-1">
          {enemyCount}
          <span className="text-xs font-semibold text-gray-500 font-mono">UNITS</span>
        </div>
      </button>

      {/* 最高戦闘力キャラ */}
      <div className="p-4 rounded-2xl bg-[#16161A] border border-white/5 text-left relative overflow-hidden">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold">最高戦闘力</span>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        {topChar && (
          <div>
            <div className="font-extrabold text-sm text-white truncate">{topChar.name}</div>
            <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
              <span>{topChar.powerLevel}</span>
              <span className="text-[10px] text-gray-500">({topChar.rank})</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
