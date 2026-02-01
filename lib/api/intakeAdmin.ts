/**
 * 管理画面（admin）専用の intake API クライアント
 *
 * 目的：
 * - fetch を page.tsx に直書きしない
 * - API 変更時の修正箇所を1か所に集約する
 */

import type {
  AdminIntakeDetail,
  AdminIntakeListItem,
} from "@/lib/types/adminIntake";

const API_BASE = process.env.NEXT_PUBLIC_INTAKE_API_BASE;

/**
 * API_BASE が未設定の場合は即エラーにする
 * → 開発・本番での設定漏れを早期に検出するため
 */
function getApiBase(): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_INTAKE_API_BASE is not set");
  }
  return API_BASE;
}

/**
 * 管理画面：intake 一覧取得
 *
 * FastAPI: GET /admin/intakes
 * - 一覧表示用の最小データ
 * - 常に最新を取得したいため cache は使わない
 */
export async function fetchAdminIntakes(): Promise<AdminIntakeListItem[]> {
  const res = await fetch(`${getApiBase()}/admin/intakes`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin intakes: ${res.status}`);
  }

  return res.json();
}

/**
 * 管理画面：intake 詳細取得
 *
 * FastAPI: GET /admin/intakes/{id}
 * - raw payload
 * - 管理者向け summary
 */
export async function fetchAdminIntakeDetail(
  id: number
): Promise<AdminIntakeDetail> {
  const res = await fetch(`${getApiBase()}/admin/intakes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch intake detail: ${res.status}`);
  }

  return res.json();
}

/**
 * CSV ダウンロード用 URL
 *
 * FastAPI 側で CSV を生成するため、
 * フロントはリンクするだけ
 */
export function getAdminIntakeCsvUrl(): string {
  return `${getApiBase()}/admin/intakes.csv`;
}
