/**
 * StepShell.tsx
 *
 * フォーム全体の「共通レイアウト・ナビゲーション担当コンポーネント」
 *
 * 役割：
 * ・ヘッダー（院名・フォーム名・保存表示）を表示
 * ・ステップインジケーター（進捗表示）を表示
 * ・各 Step の中身（children）をカード内に配置
 * ・「戻る / 次へ / 送信」ボタンを制御
 *
 * このコンポーネントは
 * ・フォームの状態
 * ・バリデーション
 * ・入力項目
 * を一切持たない。
 *
 * 親（page.tsx）から渡された情報を
 * そのまま UI に反映する「純粋なレイアウト部品」。
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { ArrowLeft, ArrowRight, Save, HandHeart, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * StepShell が受け取る props
 *
 * currentStep   : 現在のステップ番号（1始まり）
 * totalSteps    : 総ステップ数
 * title         : 現在ステップのタイトル
 * description   : 現在ステップの説明文
 * children      : 各 Step コンポーネント（中身）
 *
 * onNext        : 「次へ / 送信」ボタン押下時の処理
 * onPrev        : 「戻る」ボタン押下時の処理
 * onStepChange  : ステップ直接移動（StepIndicator 用）
 *
 * nextDisabled  : 次ボタン無効化フラグ
 * nextLabel     : 次ボタンの文言（例：次へ / 送信）
 *
 * showSave      : 保存表示を出すかどうか
 * onSave        : 保存ボタン押下時処理（任意）
 * showHomeButton: ホームへ戻るボタンを表示するかどうか
 * onHomeClick   : ホームへ戻るボタン押下時処理（任意、未指定時は自動でlocalStorageクリア）
 */

interface StepShellProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  onStepChange?: (step: number) => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showSave?: boolean;
  onSave?: () => void;
  showHomeButton?: boolean;
  onHomeClick?: () => void;
}

/**
 * ステップ表示用ラベル
 *
 * ・StepIndicator に渡すだけ
 * ・実際の入力項目やロジックとは無関係
 */
const stepLabels = [
  '基本情報',
  '主訴・症状', 
  '既往歴・服薬',
  '生活習慣・目標',
  '確認・送信'
];

export function StepShell({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onPrev,
  onStepChange,
  nextDisabled = false,
  nextLabel = '次へ',
  showSave = true,
  onSave,
  showHomeButton = true,
  onHomeClick,
}: StepShellProps) {
  const router = useRouter();

    // 最初・最後のステップ判定（UI制御用）
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  /**
   * ホームへ戻るボタン押下時の処理
   *
   * ・確認ダイアログを表示
   * ・OK の場合のみ localStorage をクリアしてトップページへ遷移
   * ・キャンセルの場合は何もしない
   */
  const handleHomeClick = () => {
    // 確認ダイアログを表示
    const confirmed = window.confirm(
      '入力途中の内容は保存されません。\nホームへ戻りますか？'
    );

    if (!confirmed) {
      // キャンセル時は何もしない
      return;
    }

    // OK の場合のみ処理を実行
    if (onHomeClick) {
      onHomeClick();
    } else {
      // デフォルト動作：localStorage をクリアしてから遷移
      try {
        localStorage.removeItem('intake:v1');
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* =========================
          Header（固定ヘッダー）
         ========================= */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* ホームへ戻るボタン */}
              {showHomeButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHomeClick}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span>ホームへ戻る</span>
                </Button>
              )}

              {/* ロゴ・タイトル */}
              <div className="flex items-center space-x-3">
                <HandHeart className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-blue-900">カイロシガ整体院</h1>
                  <p className="text-sm text-blue-600">初回AIヒアリングナビフォーム</p>
                </div>
              </div>
            </div>

            {/* 保存表示（デスクトップのみ） */}
            {showSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="hidden sm:flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>保存済み</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* ステップ進捗インジケーター */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          onStepClick={onStepChange}
        />

        {/* メインカード（Step の中身） */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-blue-100 text-base">
              {description}
            </CardDescription>
          </CardHeader>

          {/* Step コンポーネントがここに入る */}
          <CardContent className="p-6 sm:p-8">
            {children}
          </CardContent>
        </Card>

        {/* =========================
            ナビゲーション（戻る / 次へ）
           ========================= */}
        <div className="flex justify-between items-center mt-8">

          {/* 戻るボタン */}
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isFirstStep}
            className={cn(
              'flex items-center space-x-2',
              isFirstStep ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>戻る</span>
          </Button>

            {/* ステップ数表示 */}
          <div className="text-sm text-gray-500">
            {currentStep} / {totalSteps}
          </div>

            {/* 次へ / 送信ボタン */}
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              'flex items-center space-x-2 bg-blue-600 hover:bg-blue-700',
              nextDisabled ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            <span>{nextLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* モバイル用 保存表示 */}
        {showSave && (
          <div className="sm:hidden text-center mt-4">
            <div className="inline-flex items-center space-x-2 text-sm text-green-600">
              <Save className="h-4 w-4" />
              <span>自動保存中</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
