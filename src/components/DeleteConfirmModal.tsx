import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (characterId: string) => void;
  character: Character | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  character,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [typedName, setTypedName] = useState('');

  if (!isOpen || !character) return null;

  const handleFirstStep = () => {
    setStep(2);
  };

  const handleFinalDelete = () => {
    if (typedName.trim() === character.name.trim()) {
      onConfirmDelete(character.id);
      onClose();
      setStep(1);
      setTypedName('');
    }
  };

  const handleClose = () => {
    setStep(1);
    setTypedName('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#16161A] border border-rose-500/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-gray-100 relative"
        >
          {/* ヘッダー */}
          <div className="bg-rose-950/40 p-4 border-b border-rose-500/30 flex justify-between items-center">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="font-mono text-xs">CONFIRM DELETE ({step}/2)</span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-6 space-y-5">
            {step === 1 ? (
              /* ステップ1: 一重目確認 */
              <div className="space-y-4">
                <div className="bg-[#0A0A0B] p-4 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#16161A] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    {character.iconType === 'emoji' ? (
                      character.iconValue
                    ) : (
                      <img src={character.iconValue} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-base text-white">{character.name}</div>
                    <div className="text-xs text-gray-400 font-mono">POWER: {character.powerLevel} | RANK: {character.rank}</div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  本当に「<strong className="text-rose-400">{character.name}</strong>」を削除しますか？この操作を取り消すことはできません。
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleFirstStep}
                    className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" /> 最終確認へ進む
                  </button>
                  <button
                    onClick={handleClose}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-xs transition-all"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              /* ステップ2: 二重目確認（名前入力チェック） */
              <div className="space-y-4">
                <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-200 leading-relaxed">
                  ⚠️ 誤操作を防ぐため、確認としてキャラクター名を入力してください：
                  <div className="font-mono font-bold text-sm text-white mt-1 select-all bg-[#0A0A0B] p-1.5 rounded text-center border border-white/10">
                    {character.name}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="キャラクター名を正確に入力"
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleFinalDelete}
                    disabled={typedName.trim() !== character.name.trim()}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      typedName.trim() === character.name.trim()
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 cursor-pointer'
                        : 'bg-[#0A0A0B] text-gray-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" /> 完全削除を確定する
                  </button>
                  <button
                    onClick={handleClose}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-xs transition-all"
                  >
                    取り消す
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
