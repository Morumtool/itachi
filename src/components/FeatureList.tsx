import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { ChevronDown, Sparkles, MessageSquare, Utensils, Flame, Search, User } from 'lucide-react';

interface FeatureListProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(['ally-1', 'ally-2', 'ally-6']); // デフォルトでクライマックス山桃や矢島などを開く
  const [searchTerm, setSearchTerm] = useState('');

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.features.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.catchphrase && c.catchphrase.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* 検索バー */}
      <div className="bg-[#16161A] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            イタチイタ戦隊 キャラクター特徴・名言一覧
          </h3>
          <p className="text-xs text-gray-400">
            各キャラのユニークな口癖、必殺技、一人称、作中での設定をまとめてチェック！
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="特徴・セリフで検索..."
            className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* アコーディオンリスト */}
      <div className="space-y-3">
        {filteredCharacters.map((char) => {
          const isOpen = openIds.includes(char.id);

          return (
            <div
              key={char.id}
              className="bg-[#16161A] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              {/* アコーディオンヘッダー */}
              <button
                onClick={() => toggleOpen(char.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0B] border border-white/10 flex items-center justify-center shrink-0 text-xl">
                    {char.iconType === 'emoji' ? (
                      char.iconValue
                    ) : (
                      <img src={char.iconValue} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                          char.alignment === 'ally'
                            ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30'
                            : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {char.alignment === 'ally' ? '味方' : '敵'}
                      </span>
                      <h4 className="font-extrabold text-base text-white truncate">
                        {char.name}
                      </h4>
                    </div>

                    {char.catchphrase && (
                      <p className="text-xs text-amber-300 font-medium truncate">
                        「{char.catchphrase}」
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    {isOpen ? 'たたむ' : '詳細をみる'}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </button>

              {/* アコーディオンコンテンツ */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-white/5 bg-[#0A0A0B] p-4 sm:p-6 space-y-4"
                  >
                    {/* 詳細グリッド */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {char.firstPerson && (
                        <div className="bg-[#16161A] p-2.5 rounded-xl border border-white/5">
                          <span className="text-gray-500 block mb-0.5 flex items-center gap-1 font-mono text-[10px] uppercase font-bold">
                            <User className="w-3 h-3 text-indigo-400" /> 一人称
                          </span>
                          <span className="font-bold text-gray-200">{char.firstPerson}</span>
                        </div>
                      )}

                      {char.catchphrase && (
                        <div className="bg-[#16161A] p-2.5 rounded-xl border border-white/5 col-span-1 sm:col-span-2">
                          <span className="text-gray-500 block mb-0.5 flex items-center gap-1 font-mono text-[10px] uppercase font-bold">
                            <MessageSquare className="w-3 h-3 text-amber-400" /> 口癖・決めセリフ
                          </span>
                          <span className="font-bold text-amber-300">「{char.catchphrase}」</span>
                        </div>
                      )}

                      {char.favoriteFood && (
                        <div className="bg-[#16161A] p-2.5 rounded-xl border border-white/5">
                          <span className="text-gray-500 block mb-0.5 flex items-center gap-1 font-mono text-[10px] uppercase font-bold">
                            <Utensils className="w-3 h-3 text-emerald-400" /> 好物
                          </span>
                          <span className="font-bold text-gray-200">{char.favoriteFood}</span>
                        </div>
                      )}

                      {char.specialMove && (
                        <div className="bg-[#16161A] p-2.5 rounded-xl border border-white/5 col-span-2 sm:col-span-4">
                          <span className="text-gray-500 block mb-0.5 flex items-center gap-1 font-mono text-[10px] uppercase font-bold">
                            <Flame className="w-3 h-3 text-rose-400" /> 必殺技
                          </span>
                          <span className="font-bold text-rose-300">{char.specialMove}</span>
                        </div>
                      )}
                    </div>

                    {/* 特徴テキスト */}
                    <div className="bg-[#16161A] p-3.5 rounded-xl border border-white/5">
                      <div className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-500 mb-2">【特記事項・設定】</div>
                      <ul className="space-y-1.5 text-xs text-gray-300 leading-relaxed">
                        {char.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400">・</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onSelectCharacter(char)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                      >
                        大画面でフルプロフィールを表示 →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredCharacters.length === 0 && (
          <div className="bg-[#16161A] p-8 text-center text-gray-500 text-sm rounded-2xl border border-white/5">
            検索結果に一致するキャラクターの特徴が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
};
