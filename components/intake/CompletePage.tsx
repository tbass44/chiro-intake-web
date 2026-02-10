'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { buildUserSummaryInput } from '@/lib/utils/buildUserSummaryInput';
import { ENABLE_AI_USER_SUMMARY } from '@/lib/config/featureFlags';

/**
 * CompletePage.tsx
 *
 * AIヒアリングナビの入力完了ページ
 *
 * 役割：
 * ・入力完了の感謝メッセージを表示
 * ・トップページへ戻るボタンを提供
 *
 * このコンポーネントは
 * ・状態管理を持たない
 * ・静的で安全なページ
 */

const STORAGE_KEY = 'intake:v2';

export function CompletePage() {
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const [userSummary, setUserSummary] = useState<string | null>(null);
  const [lineLinkToken, setLineLinkToken] = useState<string | null>(null);

  const router = useRouter();
  const handleBackToTop = () => {
    router.push('/');
  };

  // localStorage からヒアリング内容を復元
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setPayload(parsed);
    } catch (e) {
      console.error('failed to parse intake payload', e);
    }
  }, []);

  useEffect(() => {
    const intakeId = localStorage.getItem('intake_id');
    if (!intakeId) return;
  
    const run = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
      const res = await fetch(
        `${API_BASE_URL}/api/intake/${intakeId}/user-summary`
      );
  
      const json = await res.json();
  
      setUserSummary(json.overview);
      setLineLinkToken(json.line_link_token);
    };
  
    run();
  }, []);
 

  // ユーザー向け AI summary 用の入力データを生成（まだ表示しない）
  const userSummaryInput = payload
  ? buildUserSummaryInput(payload)
  : null;
  if (userSummaryInput) {
    // TODO: 将来ここで AI summary API に渡す
    console.log('AI summary input (user)', userSummaryInput);
  }  

    /**
   * 初回マウント時に localStorage からヒアリング内容を復元
   *
   * ・送信完了後、complete ページで一度だけ使用
   * ・表示後に localStorage は削除する
   */
  useEffect(() => {
    if (!payload) return;      
      
    const run = async () => {
      // AI に渡すための「整理済みデータ」を作成
      const input = buildUserSummaryInput(payload);

      // ▼ AIを使う場合（後日 true にするだけ）
      if (ENABLE_AI_USER_SUMMARY) {
        const res = await fetch('/api/user-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        setUserSummary(json.summary);
        return;
      }     

      // /api/intake/{id}/user-summary の戻りを受け取る
      const result = {
        summary:
          'ご入力いただいた内容をもとに、現在の状態を分かりやすく整理しています。\n\n来院時に、あなたの状態を一緒に確認していきましょう。',
        line_link_token: payload?.line_link_token ?? null,
      };
      
      setUserSummary(result.summary);
      setLineLinkToken(result.line_link_token);      

    };      
    run();
    // ユーザーに完了画面を表示したあとで削除
    localStorage.removeItem(STORAGE_KEY);
    
  }, [payload]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          ご入力ありがとうございました
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          お預かりした内容は確認のうえ、
          <br />
          施術やサポートの参考にさせていただきます。
        </p>

        {/* ===============================
            ユーザー向け：ヒアリング内容まとめ（仮）
            ※ 将来的に AI が生成した文章に差し替える予定
            ※ 現時点では診断・判断は一切行わない
        ================================ */}
        <section className="mt-10 mb-10 rounded-lg border bg-muted p-5">
          <h2 className="mb-2 text-base font-semibold">
            ヒアリング内容のまとめ
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {userSummary ??
              'ご入力いただいた内容をもとに、現在の状態を分かりやすく整理しています。'}
          </p>

        </section>

        {lineLinkToken && (
          <section className="mb-10 rounded-lg border border-green-200 bg-green-50 p-5 text-center">
            <h3 className="mb-2 text-sm font-semibold text-green-800">
              📩 LINEへの送信について
            </h3>

            <p className="mb-4 text-sm text-green-900 leading-relaxed">
            
              <div className="mb-4">
                <Button
                  onClick={() => {
                    window.open('https://lin.ee/aTBmYT4', '_blank');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  カイロシガ整体院 公式LINEを開く
                </Button>
              </div>

              今回の内容は、来院時のカウンセリングをスムーズにするため
              <strong>「カイロシガ整体院 公式LINE」</strong>にもお送りします。
              <br />
              <br />
              <strong>① 公式LINEを友だち追加</strong>
              <br />
              <strong>② 下のコードをコピーして、そのままLINEで送信</strong>
              <br />
              していただくと、内容がLINEに届きます。
            </p>

            <pre className="mb-3 inline-block rounded bg-white px-4 py-2 text-sm text-gray-800 border">
              link={lineLinkToken}
            </pre>


            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(`link=${lineLinkToken}`);
                alert('コピーしました');
              }}
            >
              コピー
            </Button>

            <p className="mt-2 text-xs text-green-800">
              ※ すでにLINEに届いている場合、この操作は不要です
            </p>
          </section>
        )}


        <Button
          onClick={handleBackToTop}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
        >
          トップへ戻る
        </Button>
      </div>
    </div>
  );
}
