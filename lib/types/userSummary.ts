// lib/types/userSummary.ts

export type UserSummaryInput = {
  mainConcern?: string;      // 主な困りごと（文言そのまま）
  onset?: string;            // 発症時期（表示用）
  severityLevel?: 'low' | 'medium' | 'high'; // つらさを段階化
  sleep?: 'good' | 'normal' | 'poor';        // 睡眠の主観評価
  stress?: 'low' | 'normal' | 'high';        // ストレスの主観評価
};
