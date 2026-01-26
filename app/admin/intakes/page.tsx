'use client';
// ↑ App Router で「クライアントコンポーネント」として動かす宣言
//   useState / useEffect / fetch を使うため必須

import { useEffect, useState } from 'react';
import Link from 'next/link'; // 一覧 → 詳細ページ遷移用

/**
 * 一覧ページで使うデータ型
 * FastAPI の GET /admin/intakes のレスポンス構造に合わせている
 */
type IntakeItem = {
  id: number;                 // DBのID
  created_at: string;         // 受付日時（ISO文字列）
  payload: {
    name?: string;            // 氏名（未入力の可能性あり）
    chiefComplaint?: string;  // 主な困りごと（未入力の可能性あり）
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

  /**
   * 画面表示時に一度だけ実行される処理
   * FastAPI の /admin/intakes から一覧データを取得する
   */
  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        // FastAPI 側の管理用一覧APIを呼び出す
        const res = await fetch('http://localhost:8000/admin/intakes');

        // HTTPエラーの場合は例外扱いにする
        if (!res.ok) {
          throw new Error('データ取得に失敗しました');
        }

        // JSONとしてレスポンスを取得
        const data = await res.json();

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

      {/* データが0件の場合 */}
      {items.length === 0 ? (
        <p>データはまだありません。</p>
      ) : (
        // データがある場合は一覧表示
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id} // React用の一意キー
              style={{
                border: '1px solid #ddd',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '4px',
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
                {new Date(item.created_at).toLocaleString()}
              </div>
              <div>
                <strong>お名前：</strong>
                {item.payload?.name || '（未入力）'}
              </div>
              <div>
                <strong>主な困りごと：</strong>
                {item.payload?.chiefComplaint || '（未入力）'}
              </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
