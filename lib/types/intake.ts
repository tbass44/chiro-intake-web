/**
 * intake.ts
 * ------------------------------------------------------
 * フォーム全体で使う型定義。
 * ※ IntakeFormData 本体は zod から生成されるため、
 *   ここでは補助的な型のみを定義する。
 */

export interface BasicInfo {
  name: string;
  furigana: string;
  dob: string;
  sex: '男' | '女' | 'その他' | '回答しない';
  occupation?: string;
  phone?: string;
  email: string;
  prefecture?: string;
  city?: string;
  // 当院を知ったきっかけ（選択式）
  referralSource:
  | '紹介'
  | 'Google検索'
  | 'SNS'
  | 'まいぷれ'
  | 'チラシ'
  | 'その他';
  // 身長（cm）
  height: number;
  // 体重（kg・任意）
  weight?: number;
}

/* =========================
 * Step2：主訴・症状（1件分）
 * ========================= */
// UI用の識別子（useFieldArray / key 用）
// DB・API では使用しない
export interface SymptomItem {
  id: string; 
  // 旧 chiefComplaint（単一） → 主訴ごとに保持
  symptom: string;
  // 急性 / 慢性 / 不明 に統一
  onset: 'acute' | 'chronic' | 'unknown' | null;
  // 5段階評価に変更
  severity: 1 | 2 | 3 | 4 | 5 | null;
  // 本人が思う原因（自由記述）
  perceivedCause: string | null;
}

export interface MedicalHistory {
  medicalHistory?: string;
  injuries?: string;
  medications?: string;
  allergies?: string;
  surgeries?: string;
  hasImplant?: boolean;
  implantDetail?: string;
}

export interface Lifestyle {
  sleepHours?: number;
  stressLevel?: number;
  exerciseFreq?: 'ほぼなし' | '週1-2' | '週3-4' | 'ほぼ毎日';
  waterIntake?: number;
  smoking?: boolean;
  alcohol?: 'なし' | 'ときどき' | '週数回' | '毎日';
  beddingType?: (
    | '硬め'
    | '普通'
    | '柔らかめ' 
    | '低反発'
    | '高反発'
    | 'その他'
  )[];

  pillowType?: (
    | '硬め'
    | '硬さ普通'
    | '柔らかめ'
    | '低い'
    | '高さ普通'
    | '高い'
    | 'その他'
  )[];

  skinCondition?: (
    | '乾燥'
    | '脂性'
    | 'ニキビ'
    | 'シワ'
    | 'シミ'
    | 'むくみ'
    | '痒み'
    | 'アトピー'
    | '赤み'
    | 'アレルギー'
    | 'その他'
  )[];
  goal: string;
  consent: boolean;
}

// IntakeFormData は intakeSchema.ts から生成される型を使用
// 型の一貫性を保つため、ここでは再エクスポートのみ
export type { IntakeFormData } from '@/lib/validation/intakeSchema';

/* =========================
 * API 共通レスポンス
 * ========================= */
export interface ApiResponse {
  success: boolean;
  message?: string;
  pdfUrl?: string;
  data?: any;
}
