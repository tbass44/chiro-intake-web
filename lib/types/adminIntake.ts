/**
 * 管理画面（admin）で使用する intake 関連の型定義
 *
 * FastAPI のレスポンス構造と 1:1 で対応させる
 * 「フロント都合の加工」はしない
 */

/**
 * 管理者向け summary（FastAPI 側で生成済み）
 */
export type AdminIntakeSummary = {
  chief_complaints: string[];
  symptom_duration: string | null;
  red_flags: string[];
  sleep_trouble: boolean | null;
  stress_level: string | null;
  clinical_focus: string | null;
};

/**
 * 一覧取得用（/admin/intakes）
 * ※ summary は含まれない
 */
export type AdminIntakeListItem = {
  id: number;
  payload: Record<string, unknown>;
  created_at: string | null;
};

/**
 * 詳細取得用（/admin/intakes/{id}）
 */
export type AdminIntakeDetail = {
  id: number;
  raw: Record<string, unknown>;
  summary: AdminIntakeSummary;
  created_at: string;
};
