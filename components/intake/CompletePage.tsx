'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { buildUserSummaryInput } from '@/lib/utils/buildUserSummaryInput';

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

const STORAGE_KEY = 'intake:v1';

export function CompletePage() {
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
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

  // ユーザー向け AI summary 用の入力データを生成（まだ表示しない）
  const userSummaryInput = payload
  ? buildUserSummaryInput(payload)
  : null;
  if (userSummaryInput) {
    // TODO: 将来ここで AI summary API に渡す
    console.log('AI summary input (user)', userSummaryInput);
  }  

  useEffect(() => {
    if (payload) {
      // ユーザーに完了画面を表示したあとで削除
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('failed to remove intake payload', e);
      }
    }
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

          <p className="text-sm text-muted-foreground leading-relaxed">
            ご入力いただいた内容をもとに、現在の状態を分かりやすく整理しています。
            <br />
            こちらは診断や判断を行うものではありません。
            <br />
            来院時に、あなたの状態を一緒に確認していきましょう。
          </p>

          {/* TODO: AI summary (user-facing)
              - importantKeys を元にした整理済みデータを入力にする
              - 不安を煽らない / 診断しない / やさしい表現
              - 管理側 summary とは完全に別ロジック
          */}
        </section>

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
