import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';
import { PowerBar } from './PowerBar';
import { parsePowerLevel, getRankBadgeColor } from '../utils/powerLevel';
import { Crown, Trophy, Shield, Swords, Info, Search } from 'lucide-react';

interface RankingTableProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [rankingTab, setRankingTableTab] = useState<'all' | 'ally' | 'enemy'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // タブによるフィルター
  const filteredList = characters.filter((c) => {
    if (rankingTab === 'ally') return c.alignment === 'ally';
    if (rankingTab === 'enemy') return c.alignment === 'enemy';
    return true;
  });

  // 検索フィルター
  const searchedList = filteredList.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.powerLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 戦闘力順ソート（`95→∞` や `100` 等を適切に数値比較）
  const sortedCharacters = [...searchedList].sort((a, b) => {
    const parsedA = parsePowerLevel(a.powerLevel);
    const parsedB = parsePowerLevel(b.powerLevel);

    // ∞フラグがある場合は最優先
    if (parsedA.isInfinite && !parsedB.isInfinite) return -1;
    if (!parsedA.isInfinite && parsedB.isInfinite) return 1;

    return parsedB.numericValue - parsedA.numericValue;
  });

  return (
    <div className="space-y-6">
      
      {/* ランキングコントロール (タブ & 検索) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#16161A] p-4 rounded-2xl border border-white/5">
        
        {/* 統合/味方/敵 タブ */}
        <div className="flex items-center gap-1.5 bg-[#0A0A0B] p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setRankingTableTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              rankingTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> 統合ランキング
          </button>

          <button
            onClick={() => setRankingTableTab('ally')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              rankingTab === 'ally'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 味方強さランキング
          </button>

          <button
            onClick={() => setRankingTableTab('enemy')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              rankingTab === 'enemy'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" /> 敵強さランキング
          </button>
        </div>

        {/* 検索フィルター */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="キャラ名・ランクで検索..."
            className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ランキング表本体 */}
      <div className="bg-[#16161A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            
            {/* テーブルヘッダー */}
            <thead>
              <tr className="bg-[#0F0F12] text-gray-500 font-bold text-[10px] uppercase font-mono tracking-widest border-b border-white/5">
                <th className="py-3.5 px-4 w-16 text-center">RANKING</th>
                <th className="py-3.5 px-4">CHARACTER</th>
                <th className="py-3.5 px-4 w-48 sm:w-64">POWER LEVEL</th>
                <th className="py-3.5 px-4 w-20 text-center">CLASS</th>
                <th className="py-3.5 px-4 w-20 text-center">ACTION</th>
              </tr>
            </thead>

            {/* テーブルボディ */}
            <tbody className="divide-y divide-white/5">
              {sortedCharacters.map((char, index) => {
                const rankNum = index + 1;
                const rankColors = getRankBadgeColor(char.rank);

                // 1~3位の特別メダル背景
                const isTop3 = rankNum <= 3;
                let rankBg = 'text-zinc-400 font-bold';
                let crownColor = '';

                if (rankNum === 1) {
                  rankBg = 'text-amber-400 font-black text-base';
                  crownColor = 'text-amber-400';
                } else if (rankNum === 2) {
                  rankBg = 'text-slate-300 font-black text-base';
                  crownColor = 'text-slate-300';
                } else if (rankNum === 3) {
                  rankBg = 'text-amber-600 font-black text-base';
                  crownColor = 'text-amber-600';
                }

                return (
                  <motion.tr
                    key={char.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => onSelectCharacter(char)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    {/* 順位 */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isTop3 && <Crown className={`w-4 h-4 ${crownColor}`} />}
                        <span className={rankBg}>{rankNum}位</span>
                      </div>
                    </td>

                    {/* キャラクター名 & アバター */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0A0A0B] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden text-lg">
                          {char.iconType === 'emoji' ? (
                            char.iconValue
                          ) : (
                            <img src={char.iconValue} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div>
                          <div className="font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                            <span>{char.name}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-extrabold border ${
                                char.alignment === 'ally'
                                  ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30'
                                  : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {char.alignment === 'ally' ? '味方' : '敵'}
                            </span>
                          </div>
                          {char.catchphrase && (
                            <div className="text-[11px] text-gray-400 italic line-clamp-1">
                              「{char.catchphrase}」
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 戦闘力プログレスバー */}
                    <td className="py-3.5 px-4">
                      <PowerBar powerLevel={char.powerLevel} showText={true} height="sm" />
                    </td>

                    {/* ランクバッジ */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block text-xs font-mono px-2.5 py-0.5 rounded-md border font-extrabold ${rankColors.bg} ${rankColors.text} ${rankColors.border}`}
                      >
                        {char.rank}
                      </span>
                    </td>

                    {/* 詳細ボタン */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCharacter(char);
                        }}
                        className="p-1.5 bg-white/5 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold border border-white/10"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}

              {sortedCharacters.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 text-sm">
                    該当するキャラクターが見つかりませんでした。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
