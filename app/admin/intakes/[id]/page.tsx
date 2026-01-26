'use client';
// ↑ useEffect / useState / ルーターを使うためクライアントコンポーネント

// output: 'export' を使っていた名残対策
// このページは常に動的にレンダリングする
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateIntakeSummary } from '@/lib/utils/intakeSummary';

/**
 * ★ 追加：日本語ラベル定義
 * payload のキーを「施術者が読む表現」に変換するためのマップ
 */
const LABELS: Record<string, string> = {
  name: 'お名前',
  furigana: 'ふりがな',
  dob: '生年月日',
  sex: '性別',
  phone: '電話番号',
  email: 'メールアドレス',
  prefecture: '都道府県',
  city: '市区町村',
  occupation: 'ご職業',

  chiefComplaint: '主な困りごと',
  onset: '発症時期',
  painScale: 'つらさの目安（0-10）',
  aggravatingFactors: '悪化要因',
  relievingFactors: '楽になる要因',

  sleepHours: '睡眠時間',
  stressLevel: 'ストレス度',
  exerciseFreq: '運動習慣',
  deskHours: 'デスクワーク時間',
  waterIntake: '水分摂取量',

  medicalHistory: '既往歴',
  injuries: 'ケガの経験',
  surgeries: '手術歴',
  medications: '服薬',
  allergies: 'アレルギー',

  smoking: '喫煙',
  alcohol: '飲酒',
  goal: 'ご本人の希望',
  previousTreatments: 'これまでに受けたケア・施術',
  consent: '同意確認',
};

/**
 * 詳細ページで使うデータ型
 * GET /admin/intakes/{id} のレスポンス構造
 */
type IntakeDetail = {
  id: number;                     // DBのID
  created_at: string;             // 受付日時
  payload: Record<string, any>;   // ヒアリング内容（キーは固定しない）
};

export default function AdminIntakeDetailPage() {
  // URLの /admin/intakes/[id] の id を取得
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  /**
   * data    : 取得した1件分のヒアリングデータ
   * loading : 取得中かどうか
   * error   : エラー時のメッセージ
   * コピー状態管理（コピー完了表示用）
   */
  const [data, setData] = useState<IntakeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /**
   * id が変わったとき（＝ページ表示時）に
   * FastAPI の詳細取得APIを呼び出す
   */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/admin/intakes/${id}`
        );

        // 404 / 500 などの場合
        if (!res.ok) {
          throw new Error('取得失敗');
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError('詳細を取得できませんでした');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]); // id が変わったら再取得

  // ローディング表示
  if (loading) {
    return <div>読み込み中...</div>;
  }

  // エラー表示
  if (error) {
    return <div>{error}</div>;
  }

  // データが存在しない場合
  if (!data) {
    return <div>データが見つかりません。</div>;
  }

  // データが存在する場合
  const payload = data.payload;

    /**
   * ★ 追加：施術者が最初に見るべき重要項目
   */
    const importantKeys = [
      'name',
      'chiefComplaint',
      'onset',
      'painScale',
      'previousTreatments',
      'sleepHours',
      'stressLevel',
      'exerciseFreq',
      'goal',
      'consent',
      ];

  /**
   * 要点まとめ文をクリップボードにコピーする処理
   * ・施術者がカルテ等へ転記しやすくするため
   * ・ロジックには一切影響しないUI補助
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);

      // 表示を一時的に「コピーしました」に切り替える
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // 失敗しても画面は壊さない（念のためログのみ）
      console.error('copy failed', e);
    }
  };

  /**
   * importantKeys + LABELS を
   * summary生成用の形式に変換
   * （キー名と日本語ラベルをセットで渡す）
   */
  const importantKeySpecs = importantKeys.map((key) => ({
    key,
    label: LABELS[key] ?? key,
  }));

  /**
   * 施術者向け要点まとめ文章を生成
   * ・AI未使用
   * ・完全ルールベース
   * ・薬事リスク回避（断定しない表現）
   */
  const summaryText = generateIntakeSummary(payload, importantKeySpecs, {
    mode: 'paragraph', // 自然文モード
  });    

  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>
        AIヒアリングナビ 詳細
      </h1>

      <div style={{ marginBottom: '16px' }}>
        <strong>受付日時：</strong>
        {new Date(data.created_at).toLocaleString()}
      </div>

      <hr style={{ marginBottom: '16px' }} />

      {/* ★ 追加：施術者向け要約ブロック */}
      <h2>施術者向け要点</h2>
      <table>
        <tbody>
          {importantKeys.map((key) => (
            <tr key={key}>
              <td style={{ fontWeight: 'bold', paddingRight: '12px' }}>
                {LABELS[key] || key}
              </td>
              <td>
                {Array.isArray(payload[key])
                  ? payload[key].join(', ')
                  : String(payload[key] ?? '未入力')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* ★ 追加：全入力データ（確認・検証用） */}
      <h2>入力内容（全項目）</h2>
      <table>
        <tbody>
          {Object.entries(payload).map(([key, value]) => (
            <tr key={key}>
              <td style={{ fontWeight: 'bold', paddingRight: '12px' }}>
                {LABELS[key] || key}
              </td>
              <td>
                {Array.isArray(value)
                  ? value.join(', ')
                  : String(value ?? '')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 施術前に確認すべき要点まとめ */}
      <section className="mt-6 rounded-lg border bg-muted p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">
            施術前の要点まとめ
          </h3>

          {/* カルテ転記用コピー機能 */}
          <button
            onClick={handleCopy}
            className="text-xs text-primary hover:underline"
          >
            {copied ? 'コピーしました' : 'コピー'}
          </button>
        </div>

        {/* 改行を保持したまま文章を表示 */}
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
          {summaryText}
        </pre>
      </section>

      {/* 一覧ページへ戻る */}
      <div style={{ marginTop: '24px' }}>
        <button onClick={() => router.push('/admin/intakes')}>
          一覧へ戻る
        </button>
      </div>
    </main>
  );
}
