export type Alignment = 'ally' | 'enemy' | 'other';

export type ResponseStatus =
  | '出撃中'
  | '待機中'
  | 'クライマックス突入'
  | '自主規制中'
  | '睡眠中'
  | '世界破壊準備中'
  | '潜伏中';

export interface Character {
  id: string;
  name: string;
  alignment: Alignment;
  powerLevel: string; // e.g. "95→∞", "95s_", "100", "50"
  rank: string; // e.g. "EX+", "EX", "SS", "S", "A+", "A", "B+", "B", "C", "E"
  iconType: 'emoji' | 'url' | 'upload';
  iconValue: string; // Emoji character OR image URL OR base64
  firstPerson?: string; // 一人称
  catchphrase?: string; // 口癖
  favoriteFood?: string; // 好物
  specialMove?: string; // 必殺技
  status: ResponseStatus;
  features: string[]; // 特徴・説明（改行テキストなど）
  isCustom?: boolean; // ユーザーが作成したキャラかどうか
  createdAt: number;
}

export interface DiscordUser {
  id: string;
  username: string;
  globalName: string;
  avatar: string; // Avatar URL or emoji
  inTargetServer: boolean; // 特定のサーバーに参加しているかどうか
}

export type ViewMode = 'catalog' | 'ranking' | 'features' | 'guide';
