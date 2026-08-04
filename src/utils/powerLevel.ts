export interface ParsedPowerLevel {
  numericValue: number;
  isInfinite: boolean;
  rawString: string;
  displayRankPercentage: number; // 0 to 100
}

/**
 * 戦闘力文字列を解析する関数
 * - 例: "95s_" -> 数値 95
 * - 例: "95→∞", "95->∞" -> 数値 95, isInfinite: true
 * - 例: "100" -> 数値 100
 */
export function parsePowerLevel(powerStr: string): ParsedPowerLevel {
  const rawString = powerStr.trim();
  
  // ∞ または ->∞ のチェック
  const hasInfinity = /∞|infinity/i.test(rawString);
  
  // 数字のみを抽出
  const match = rawString.match(/\d+/);
  let numericValue = match ? parseInt(match[0], 10) : 0;
  
  // 数値の最大最小クランプ (100を超える数値の場合もバーは100相当で表現)
  if (numericValue < 0) numericValue = 0;

  // バー表示用パーセンテージ（100を100%とする、100超は100%）
  const displayRankPercentage = Math.min(Math.max(numericValue, 0), 100);

  return {
    numericValue,
    isInfinite: hasInfinity,
    rawString,
    displayRankPercentage,
  };
}

/**
 * ランクに基づく色の定義（バッジ用）
 */
export function getRankBadgeColor(rank: string): {
  bg: string;
  text: string;
  border: string;
  glow?: string;
} {
  const normalized = rank.toUpperCase().trim();
  switch (normalized) {
    case 'EX+':
      return {
        bg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600',
        text: 'text-white font-extrabold',
        border: 'border-amber-300',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]',
      };
    case 'EX':
      return {
        bg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
        text: 'text-white font-bold',
        border: 'border-cyan-300',
        glow: 'shadow-[0_0_10px_rgba(6,182,212,0.5)]',
      };
    case 'SS':
      return {
        bg: 'bg-purple-600',
        text: 'text-purple-100 font-bold',
        border: 'border-purple-400',
      };
    case 'S':
      return {
        bg: 'bg-rose-600',
        text: 'text-rose-100 font-bold',
        border: 'border-rose-400',
      };
    case 'A+':
    case 'A':
      return {
        bg: 'bg-emerald-600',
        text: 'text-emerald-100 font-bold',
        border: 'border-emerald-400',
      };
    case 'B+':
    case 'B':
      return {
        bg: 'bg-blue-600',
        text: 'text-blue-100 font-semibold',
        border: 'border-blue-400',
      };
    case 'C':
      return {
        bg: 'bg-slate-600',
        text: 'text-slate-200 font-medium',
        border: 'border-slate-500',
      };
    case 'E':
    default:
      return {
        bg: 'bg-zinc-700',
        text: 'text-zinc-300 font-normal',
        border: 'border-zinc-600',
      };
  }
}
