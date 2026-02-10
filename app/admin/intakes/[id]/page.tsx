'use client';
// ↑ useEffect / useState / ルーターを使うためクライアントコンポーネント

// output: 'export' を使っていた名残対策
// このページは常に動的にレンダリングする
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateIntakeSummary } from '@/lib/utils/intakeSummary';

/**
 * 日本語ラベル定義
 * payload のキーを「施術者が読む表現」に変換するためのマップ
 */
const LABELS: Record<string, string> = {
  name: '名前',
  furigana: 'ふりがな',
  dob: '生年月日',
  sex: '性別',
  height: '身長',
  weight: '体重',
  phone: '電話番号',
  email: 'メールアドレス',
  prefecture: '都道府県',
  city: '市区町村',
  occupation: '職業',
  referralSource: '当院を知ったきっかけ',

  symptoms: '主訴・症状',
  // onset: '発症時期',
  // painScale: 'つらさの目安（0-10）',
  // aggravatingFactors: '悪化要因',
  // relievingFactors: '楽になる要因',
  previousTreatments: 'これまでに受けたケア・施術',

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
  consent: '同意確認',
  beddingType: '布団の種類',
  pillowType: '枕の種類',
  hasImplant: '金属・人工関節の有無',
  implantDetail: '金属・人工関節の部位',
  skinCondition: '肌の状態',
};

/**
 * 詳細ページで使うデータ型
 * GET /admin/intakes/{id} のレスポンス構造
 */
type IntakeDetail = {
  id: number;                     // DBのID
  created_at: string;             // 受付日時
  // FastAPI 側では payload ではなく raw というキーで返される
  raw: Record<string, any>;
  // 管理者向け summary
  summary?: {
    chief_complaints?: string[];
    main_symptom?: string | null;
    severity?: number | null;
    onset?: string | null;
    symptom_count?: number;
    red_flags?: string[];
    clinical_focus?: string | null;
    stress_level?: number | null;
    sleep_hours?: number | null;
  };
  line_status?: '未連携' | '連携済';
  line_sent_at?: string | null;
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        const res = await fetch(
          `${API_BASE_URL}/admin/intakes/${id}`
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

  // 詳細APIは payload ではなく raw を返すため、raw を payload として扱う
  const payload = data.raw ?? {};
  const summary = data.summary ?? {};

  /**
   * v2: 主訴は symptoms[0] を基準にする
   */
  const mainSymptom = Array.isArray(payload.symptoms)
    ? payload.symptoms[0]
    : null;

    // chronic / acute を日本語にする
    const translateOnset = (value?: string) => {
      switch (value) {
        case 'acute':
          return '急性';
        case 'chronic':
          return '慢性';
        case 'unknown':
          return '不明';
        default:
          return '未入力';
      }
    };

  /**
   * 施術者向け要点まとめ（完全ルールベース）
   * ※ AI未使用／診断しない／事実のみ
   */
  const summaryText = `
  【主訴】
  ${mainSymptom?.symptom ?? '未入力'}

  【発症タイプ】
  ${translateOnset(mainSymptom?.onset)}

  【つらさ（5段階）】
  ${mainSymptom?.severity ?? '未入力'}

  【原因（本人認識）】
  ${mainSymptom?.perceivedCause ?? '未入力'}

  【生活状況】
  睡眠時間：${payload.sleepHours ?? '未入力'}
  ストレス度：${payload.stressLevel ?? '未入力'}

  【来院目的】
  ${payload.goal ?? '未入力'}
  `.trim();

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

  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>
        AIヒアリングナビ 詳細
      </h1>

      <div style={{ marginBottom: '16px' }}>
        <strong>受付日時：</strong>
        {new Date(data.created_at).toLocaleString()}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <strong>LINE連携：</strong>{' '}
        {data.line_status === '連携済' ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            🟢 連携済
            {data.line_sent_at && (
              <span style={{ marginLeft: '8px', color: '#555', fontWeight: 'normal' }}>
                （送信：{new Date(data.line_sent_at).toLocaleString()}）
              </span>
            )}
          </span>
        ) : (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            🔴 未連携
          </span>
        )}
      </div>

      {data.line_status === '未連携' && (
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={async () => {
              const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

              const res = await fetch(
                `${API_BASE_URL}/admin/intakes/${data.id}/resend-line`,
                { method: 'POST' }
              );

              const json = await res.json();
              alert(json.message ?? json.status);
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f59e0b',
              color: '#fff',
              borderRadius: '4px',
            }}
          >
            LINE再連携を促す
          </button>
        </div>
      )}

      {/* =========================
          管理者向けサマリー
         ========================= */}
      <section
        style={{
          marginBottom: '24px',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <h2>管理者向けサマリー</h2>

        <div>
          <strong>主訴：</strong>
          {summary.chief_complaints?.join('、') ?? '—'}
        </div>

        <div>
          <strong>つらさ：</strong>
          {mainSymptom?.severity
          ? `${mainSymptom.severity} / 5`
          : '—'}
        </div>

        <div>
          <strong>発症：</strong>
          {mainSymptom?.onset
          ? translateOnset(mainSymptom.onset)
          : '—'}
        </div>

        <div>
          <strong>症状数：</strong>
          {summary.symptom_count ?? 0}
        </div>

        <div>
          <strong>施術フォーカス：</strong>
          {summary.clinical_focus ?? '—'}
        </div>

        <div>
          <strong>注意点：</strong>
          {summary.red_flags && summary.red_flags.length > 0
            ? summary.red_flags.join('、')
            : '特になし'}
        </div>
      </section>

      {/* =========================
          主訴・症状（v2）
         ========================= */}
      <h2>主訴・症状</h2>

      {Array.isArray(payload.symptoms) && payload.symptoms.length > 0 ? (
        payload.symptoms.map((s: any, index: number) => (
          <div
            key={s.id ?? index}
            style={{
              border: '1px solid #eee',
              padding: '12px',
              marginBottom: '8px',
            }}
          >
            <div><strong>症状 {index + 1}：</strong>{s.symptom}</div>
            <div>発症：{translateOnset(s.onset)}</div>
            <div>つらさ：{s.severity ?? '未入力'} / 5</div>
            <div>原因（本人認識）：{s.perceivedCause ?? '未入力'}</div>
          </div>
        ))
      ) : (
        <div>症状の入力はありません</div>
      )}

      {/* =========================
          施術者向け要点まとめ
         ========================= */}
      <section
        style={{
          marginTop: '24px',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>施術前の要点まとめ</h3>
          <button onClick={handleCopy}>
            {copied ? 'コピーしました' : 'コピー'}
          </button>
        </div>

        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {summaryText}
        </pre>
      </section>

      {/* =========================
          全入力データ（検証用）
         ========================= */}
      <h2 style={{ marginTop: '24px' }}>入力内容（全項目）</h2>
      <table>
        <tbody>
          {Object.entries(payload).map(([key, value]) => (
            <tr key={key}>
              <td style={{ fontWeight: 'bold', paddingRight: '12px' }}>
                {LABELS[key] ?? key}
              </td>
              <td>
                {Array.isArray(value)
                  ? value.map((v, i) =>
                      typeof v === 'object'
                        ? `${i + 1}. ${v.symptom ?? ''}`
                        : String(v)
                    ).join(' / ')
                  : String(value ?? '')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '24px' }}>
        <button onClick={() => router.push('/admin/intakes')}>
          一覧へ戻る
        </button>
      </div>
    </main>
  );
}
