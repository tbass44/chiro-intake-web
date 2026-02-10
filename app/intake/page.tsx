/**
 * app/intake/page.tsx
 *
 * AIヒアリングナビフォーム全体の「画面統括・進行管理ページ」
 *
 * 役割：
 * ・各 Step コンポーネントを切り替えて表示する
 * ・現在のステップ番号をもとに画面構成を決める
 * ・ステップ間のバリデーション・遷移制御を行う
 * ・最終送信処理（API呼び出し）を担当する
 *
 * このファイルは「入力項目の中身」は持たない。
 * 実際のフォーム状態・保存・バリデーションは
 * useIntakeForm（司令塔）にすべて委譲している。
 *
 * ＝ このファイルは「進行役・組み立て係」
 */

'use client';

import { useState,useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { StepShell } from '@/components/intake/StepShell';
import { Step1Basic } from '@/components/intake/Step1Basic';
import { Step2Symptoms } from '@/components/intake/Step2Symptoms';
import { Step3History } from '@/components/intake/Step3History';
import { Step4Lifestyle } from '@/components/intake/Step4Lifestyle';
import { Step5Review } from '@/components/intake/Step5Review';
import { useIntakeForm } from '@/lib/hooks/useIntakeForm';
import { submitIntakeForm } from '@/lib/utils/fetcher';
import { toast } from 'sonner';
import { ApiResponse, IntakeFormData } from '@/lib/types/intake';
import { useRouter } from 'next/navigation';


/**
 * 各ステップのタイトル・説明文定義
 *
 * ・UI 表示専用
 * ・step番号（1〜5）と index（0〜4）が対応
 * ・項目追加時はここも合わせて修正する
 */
const stepConfig = [
  {
    title: '基本情報',
    description: 'お客様の基本的な情報を入力してください',
  },
  {
    title: '主訴・症状',
    description: '現在の症状について詳しくお聞かせください',
  },
  {
    title: '既往歴・服薬',
    description: '過去の病歴や現在の服薬状況について教えてください',
  },
  {
    title: '生活習慣・目標',
    description: '生活習慣と今後の目標についてお聞かせください',
  },
  {
    title: '確認・送信',
    description: '入力内容をご確認の上、送信してください',
  },
];

export default function IntakePage() {
    /**
   * useIntakeForm から取得するもの
   *
   * form        : react-hook-form の制御オブジェクト
   * currentStep : 現在のステップ番号（1〜5）
   * isLoaded    : localStorage 復元完了フラグ
   * nextStep    : 次のステップへ進む
   * prevStep    : 前のステップへ戻る
   * goToStep   : 任意のステップへ移動（レビュー画面用）
   * clearStorage: localStorage の問診データ削除
   */
  const { form, currentStep, isLoaded, nextStep, prevStep, goToStep, clearStorage } = useIntakeForm();
  const router = useRouter();
    /**
   * 送信中フラグ（多重送信防止）
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * 現在ステップに対応するタイトル・説明文
   */
  const currentConfig = stepConfig[currentStep - 1];

  
  /**
   * 現在のステップで「必須項目だけ」バリデーションをかける
   *
   * ・次へ進むとき専用
   * ・全体 validation ではない
   */
  const validateCurrentStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);
    return isValid;
  };

  // 次ステップ遷移で画面トップに移動
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);  

    /**
   * ステップごとの「必須フィールド定義」
   *
   * ・ここに含まれる項目だけが「次へ」押下時にチェックされる
   * ・schema 側の必須定義とは役割が違う点に注意
   * ・UI進行制御用の軽量チェック
   */
  const getStepFields = (step: number) => {
    switch (step) {
      case 1:
        return ['name', 'furigana', 'dob', 'sex', 'email', 'height', 'referralSource'] as const;
      case 2:
        return ['symptoms'] as const;
      case 3:
        return [] as const; // Step3 は必須項目なし
      case 4:
        return ['goal', 'consent'] as const;
      default:
        return [] as const;
    }
  };

    /**
   * 「次へ」ボタン押下時の処理
   *
   * ・現在ステップの必須項目をチェック
   * ・OKなら nextStep()
   * ・NGならトースト表示
   */
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      nextStep();
    } else {
      toast.error('必須項目を入力してください');
    }
  };

    /**
   * 最終送信処理
   *
   * ・全項目バリデーション
   * ・API へ送信
   * ・成功時：localStorage クリア
   * ・失敗時：エラーメッセージ表示
   */
    const handleSubmit = async () => {
      setIsSubmitting(true);
    
      try {
        // 全体バリデーション
        const isValid = await form.trigger();
        // バリデーションに失敗した場合はエラーメッセージを表示
        if (!isValid) {
          toast.error('入力内容に不備があります。確認してください。');
          setIsSubmitting(false);
          return;
        }
    
        const formData = form.getValues();

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!API_BASE_URL) {
          throw new Error('API base URL is not defined');
        }
        
        const res = await fetch(`${API_BASE_URL}/api/intake`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
       
    
        // 成功・失敗をここで判定
        if (!res.ok) {
          throw new Error(await res.text());
        }

        // レスポンスJSONを取得
        const json = await res.json();

        // intake_id を保存
        localStorage.setItem('intake_id', String(json.intake_id));

        // 成功したら完了画面へ
        router.push('/intake/complete');
    
      } catch (e) {
        console.error(e);
        toast.error('送信に失敗しました');
        setIsSubmitting(false); // ← 失敗時だけ戻す
      }
    };

    /**
   * 現在のステップに応じて表示する Step コンポーネントを切り替える
   *
   * ・各 Step は UI 専用
   * ・control だけを渡す
   */
  const renderCurrentStep = () => {
    if (!isLoaded) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <Step1Basic control={form.control} />;
      case 2:
        return <Step2Symptoms control={form.control} />;
      case 3:
        return <Step3History control={form.control} />;
      case 4:
        return <Step4Lifestyle control={form.control} />;
      case 5:
        return (
          <Step5Review
            control={form.control}
            onEdit={goToStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

    /**
   * 「次へ」ボタンを無効化する条件
   *
   * ・未ロード中
   * ・必須フィールドが空
   * ・送信中
   */
  const isNextDisabled = () => {
    if (!isLoaded) return true;
    if (currentStep === 5) return false;
    
    const stepFields = getStepFields(currentStep);
    if (stepFields.length === 0) return false;
    
    const formValues = form.getValues();
    
    return stepFields.some(field => {
      const value = formValues[field];
      // 文字列の場合は空文字チェック、booleanの場合はfalseチェック
      if (typeof value === 'string') {
        return !value || value.trim() === '';
      }
      if (typeof value === 'boolean') {
        return value === false;
      }
      if (typeof value === 'number') {
        return value === 0;
      }
      return value === undefined || value === null;
    });
  };

    /**
   * 次ボタンのラベル切り替え
   */
  const getNextLabel = () => {
    if (currentStep === 5) return '送信';
    return '次へ';
  };

    /**
   * localStorage 復元前のローディング画面
   */
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">フォームを読み込んでいます...</p>
        </div>
      </div>
    );
  }

    /**
   * 実際のフォーム描画
   *
   * ・Form / form タグは react-hook-form 用のラッパー
   * ・submit は JS 側で制御するため preventDefault
   * ・StepShell がナビゲーション・レイアウトを担当
   */
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <StepShell
          currentStep={currentStep}
          totalSteps={5}
          title={currentConfig.title}
          description={currentConfig.description}
          onNext={currentStep === 5 ? handleSubmit : handleNext}
          onPrev={currentStep > 1 ? prevStep : undefined}
          onStepChange={goToStep}
          nextDisabled={isNextDisabled() || isSubmitting}
          nextLabel={getNextLabel()}
          showSave={currentStep < 5}
          // showHomeButton={!submitResult?.success}
        >
          {renderCurrentStep()}
        </StepShell>
      </form>
    </Form>
  );
}
