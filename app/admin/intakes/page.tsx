'use client';
// ↑ App Router で「クライアントコンポーネント」として動かす宣言
//   useState / useEffect / fetch を使うため必須

import { useEffect, useState } from 'react';
import Link from 'next/link'; // 一覧 → 詳細ページ遷移用
// 直書き fetch をやめ、管理画面用 API クライアントを使用する
import {
  fetchAdminIntakes,
  getAdminIntakeCsvUrl,
} from "@/lib/api/intakeAdmin";

/**
 * 一覧ページで使うデータ型
 * FastAPI の GET /admin/intakes のレスポンス構造に合わせている
 */
type IntakeItem = {
  id: number;
  created_at: string | null;
  payload: {
    name?: string;
  };
  summary?: {
    main_symptom?: string | null;
    severity?: number | null;
    symptom_count?: number;
    chief_complaints?: string[]; 
    red_flags?: string[];
    clinical_focus?: string | null;
  };
};


export default function AdminIntakesPage() {
  /**
   * items   : 取得したヒアリング一覧データ
   * loading : データ取得中かどうか
   * error   : エラーが起きた場合のメッセージ
   */
  const [items, setItems] = useState<IntakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 検索条件（一覧用）
  const [nameQuery, setNameQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  

  // 注意フラグ判定（一覧用）
  const hasRedFlag = (item: IntakeItem) =>
    Array.isArray(item.summary?.red_flags) &&
    item.summary!.red_flags!.length > 0;

    // 一覧検索（名前／日付）
    const filteredItems = items.filter((item) => {
      // 名前検索（payload.name を部分一致）
      const name = item.payload?.name ?? '';
      const matchName =
        nameQuery === '' ||
        name.toLowerCase().includes(nameQuery.toLowerCase());

      // 日付検索（created_at を YYYY-MM-DD 文字列として一致）
      const dateStr = item.created_at ?? '';
      const matchDate =
        dateQuery === '' || dateStr.includes(dateQuery);

      return matchName && matchDate;
    });

  /**
   * 画面表示時に一度だけ実行される処理
   * FastAPI の /admin/intakes から一覧データを取得する
   */
  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        // FastAPI 側の管理用一覧APIを呼び出す

        // FastAPI の管理用一覧APIを
        // 直書き fetch ではなく API クライアント経由で呼び出す
        const data = await fetchAdminIntakes();
        // 一覧データを state に保存
        setItems(data);

      } catch (err) {
        // 通信失敗・サーバーエラー時
        setError('一覧を取得できませんでした');
      } finally {
        // 成功・失敗に関わらずローディング終了
        setLoading(false);
      }
    };

    fetchIntakes();
  }, []); // 空配列 → 初回表示時のみ実行

  // データ取得中の表示
  if (loading) {
    return <div>読み込み中...</div>;
  }

  // エラー時の表示
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>
        AIヒアリングナビ 一覧
      </h1>

        {/* [追加] 一覧検索（名前／日付） */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px' }}>
            名前検索
          </label>
          <input
            type="text"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="例：山田"
            style={{ padding: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px' }}>
            日付検索（YYYY-MM-DD）
          </label>
          <input
            type="text"
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
            placeholder="例：2026-02-01"
            style={{ padding: '6px', border: '1px solid #ccc' }}
          />
        </div>
      </div>
      
      {/* [追加] CSV ダウンロード導線 */}
      <div style={{ marginBottom: '16px' }}>
        <a
          href={getAdminIntakeCsvUrl()}
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            textDecoration: 'none',
          }}
        >
          CSV ダウンロード
        </a>
      </div>

      {/* データが0件の場合 */}
      {filteredItems.length === 0 ? (
        <p>データはまだありません。</p>
      ) : (
        // データがある場合は一覧表示
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredItems.map((item) => (
            <li
              key={item.id} // React用の一意キー
              style={{
                border: '1px solid #ddd',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '4px',
                // 注意ありの行は薄くハイライト
                background: hasRedFlag(item) ? '#fff7e6' : 'transparent',
              }}
            >

               {/* 詳細ページへのリンク */}
               <Link
                href={`/admin/intakes/${item.id}`}
                style={{
                  display: 'block',
                  border: '1px solid #ddd',
                  padding: '12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
              <div>
                <strong>受付日時：</strong>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : '（日時不明）'}
              </div>
              <div>
                <strong>お名前：</strong>
                {item.payload?.name || '（未入力）'}
              </div>
              <div>
                <strong>主な困りごと：</strong>
                {item.summary?.chief_complaints?.join('、') || '（未入力）'}
              </div>

              {/* 注意フラグ表示 */}
              {hasRedFlag(item) && (
                <div style={{ color: '#d97706', fontWeight: 'bold' }}>
                  ⚠ 注意あり
                </div>
              )}

              {/* 施術フォーカス（あれば表示） */}
              {item.summary?.clinical_focus && (
                <div>
                  <strong>施術フォーカス：</strong>
                  {item.summary.clinical_focus}
                </div>
              )}


              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
