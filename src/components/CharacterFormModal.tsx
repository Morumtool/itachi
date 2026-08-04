import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, Alignment } from '../types';
import { X, Upload, Smile, Link as LinkIcon, Sparkles, AlertCircle } from 'lucide-react';

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (characterData: Omit<Character, 'id' | 'createdAt'>, editId?: string) => void;
  editingCharacter: Character | null;
}

const EMOJI_PRESETS = [
  '⚡', '🍑', '🏃', '💪', '🎮', '🔒', '🍡', '🎲', '🍲', '❓',
  '🐹', '🥜', '💥', '👁️', '💤', '💮', '🐈', '☘️', '🩳', '👾',
  '🥷', '🤖', '🦊', '🦁', '🐉', '🔥', '👑', '⚔️', '🛡️', '🌟'
];

export const CharacterFormModal: React.FC<CharacterFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCharacter,
}) => {
  const [name, setName] = useState('');
  const [alignment, setAlignment] = useState<Alignment>('ally');
  const [powerLevel, setPowerLevel] = useState('80');
  const [rank, setRank] = useState('A');
  const [iconType, setIconType] = useState<'emoji' | 'url' | 'upload'>('emoji');
  const [iconValue, setIconValue] = useState('🥷');
  const [firstPerson, setFirstPerson] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [specialMove, setSpecialMove] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editingCharacter) {
      setName(editingCharacter.name);
      setAlignment(editingCharacter.alignment);
      setPowerLevel(editingCharacter.powerLevel);
      setRank(editingCharacter.rank);
      setIconType(editingCharacter.iconType);
      setIconValue(editingCharacter.iconValue);
      setFirstPerson(editingCharacter.firstPerson || '');
      setCatchphrase(editingCharacter.catchphrase || '');
      setFavoriteFood(editingCharacter.favoriteFood || '');
      setSpecialMove(editingCharacter.specialMove || '');
      setFeaturesText(editingCharacter.features.join('\n'));
      if (editingCharacter.iconType !== 'emoji') {
        setPreviewDataUrl(editingCharacter.iconValue);
      } else {
        setPreviewDataUrl(null);
      }
    } else {
      // リセット
      setName('');
      setAlignment('ally');
      setPowerLevel('80');
      setRank('A');
      setIconType('emoji');
      setIconValue('🥷');
      setFirstPerson('俺');
      setCatchphrase('');
      setFavoriteFood('');
      setSpecialMove('');
      setFeaturesText('');
      setPreviewDataUrl(null);
    }
  }, [editingCharacter, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconType('upload');
        setIconValue(result);
        setPreviewDataUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    onSave(
      {
        name: name.trim(),
        alignment,
        powerLevel: powerLevel.trim() || '50',
        rank: rank.trim() || 'B',
        iconType,
        iconValue,
        firstPerson: firstPerson.trim(),
        catchphrase: catchphrase.trim(),
        favoriteFood: favoriteFood.trim(),
        specialMove: specialMove.trim(),
        features: features.length > 0 ? features : ['特記事項なし'],
      },
      editingCharacter?.id
    );

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#16161A] border border-white/10 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden text-gray-100 relative my-auto"
        >
          {/* モーダルヘッダー */}
          <div className="bg-[#0F0F12] p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {editingCharacter ? 'キャラクターを編集' : 'キャラクター新規作成'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* 名前 & 陣営 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">
                  CHARACTER NAME <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: タジマックス田島"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">ALIGNMENT</label>
                <select
                  value={alignment}
                  onChange={(e) => setAlignment(e.target.value as Alignment)}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ally">味方陣営</option>
                  <option value="enemy">敵陣営</option>
                  <option value="other">第三勢力</option>
                </select>
              </div>
            </div>

            {/* 戦闘力 & ランク */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">
                  POWER LEVEL (数字/記号)
                </label>
                <input
                  type="text"
                  value={powerLevel}
                  onChange={(e) => setPowerLevel(e.target.value)}
                  placeholder="例: 85, 95s_, 95→∞"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  ※ 記号が含まれる場合（例: 95s_）は数字部を反映。「95→∞」は限界突破演出で表示されます。
                </p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">CLASS RANK</label>
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="EX+">EX+</option>
                  <option value="EX">EX</option>
                  <option value="SS">SS</option>
                  <option value="S">S</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>

            {/* アイコン指定 (絵文字, 画像URL, ファイルアップロード) */}
            <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                AVATAR SELECTION (絵文字 / URL / UPLOAD)
              </label>

              {/* アイコン種別タブ */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIconType('emoji');
                    if (!EMOJI_PRESETS.includes(iconValue)) setIconValue('🥷');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                    iconType === 'emoji'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-[#16161A] text-gray-400 border-white/10'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" /> 絵文字
                </button>

                <button
                  type="button"
                  onClick={() => setIconType('url')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                    iconType === 'url'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-[#16161A] text-gray-400 border-white/10'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> 画像URL
                </button>

                <button
                  type="button"
                  onClick={() => setIconType('upload')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                    iconType === 'upload'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-[#16161A] text-gray-400 border-white/10'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> アップロード
                </button>
              </div>

              {/* タイプ別の入力欄 */}
              {iconType === 'emoji' && (
                <div>
                  <div className="grid grid-cols-10 gap-1.5 p-2 bg-[#16161A] rounded-xl border border-white/5">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIconValue(emoji)}
                        className={`text-xl p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                          iconValue === emoji ? 'bg-indigo-600/50 border border-indigo-400' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={iconValue}
                    onChange={(e) => setIconValue(e.target.value)}
                    placeholder="任意の絵文字を入力"
                    className="w-full mt-2 bg-[#16161A] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              {iconType === 'url' && (
                <input
                  type="url"
                  value={iconValue.startsWith('http') ? iconValue : ''}
                  onChange={(e) => {
                    setIconValue(e.target.value);
                    setPreviewDataUrl(e.target.value);
                  }}
                  placeholder="https://example.com/character.png"
                  className="w-full bg-[#16161A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              )}

              {iconType === 'upload' && (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                </div>
              )}

              {/* プレビュー表示 */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <span className="text-xs text-gray-400">プレビュー:</span>
                <div className="w-10 h-10 rounded-xl bg-[#16161A] border border-white/10 flex items-center justify-center overflow-hidden">
                  {iconType === 'emoji' ? (
                    <span className="text-2xl">{iconValue}</span>
                  ) : previewDataUrl ? (
                    <img src={previewDataUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-500">なし</span>
                  )}
                </div>
              </div>
            </div>

            {/* プロフィール設定 (一人称・口癖・好物・必殺技) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">一人称</label>
                <input
                  type="text"
                  value={firstPerson}
                  onChange={(e) => setFirstPerson(e.target.value)}
                  placeholder="例: 俺, 僕, 我"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">口癖・名言</label>
                <input
                  type="text"
                  value={catchphrase}
                  onChange={(e) => setCatchphrase(e.target.value)}
                  placeholder="例: もうクライマックスです"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">好物</label>
                <input
                  type="text"
                  value={favoriteFood}
                  onChange={(e) => setFavoriteFood(e.target.value)}
                  placeholder="例: 山桃, ラーメン"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">必殺技</label>
                <input
                  type="text"
                  value={specialMove}
                  onChange={(e) => setSpecialMove(e.target.value)}
                  placeholder="例: エンディング突入"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* 特徴一覧テキスト */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block mb-1">
                特徴・詳細（1行につき1項目）
              </label>
              <textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="例: 登場すると毎回話が終盤みたいな空気になる。&#10;実際は何もしていない。"
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* ボタン */}
            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-950/40 transition-all"
              >
                {editingCharacter ? '変更を保存' : 'キャラクターを作成'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-sm transition-all"
              >
                キャンセル
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
