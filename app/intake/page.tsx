'use client';

import { useState } from 'react';
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
import { ApiResponse } from '@/lib/types/intake';

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
    description: '生活習慣と治療の目標についてお聞かせください',
  },
  {
    title: '確認・送信',
    description: '入力内容をご確認の上、送信してください',
  },
];

export default function IntakePage() {
  const { form, currentStep, isLoaded, nextStep, prevStep, goToStep, clearStorage } = useIntakeForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ApiResponse | null>(null);

  const currentConfig = stepConfig[currentStep - 1];

  const validateCurrentStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);
    return isValid;
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 1:
        return ['name', 'furigana', 'dob', 'phone', 'email'] as const;
      case 2:
        return ['chiefComplaint', 'painScale'] as const;
      case 3:
        return [] as const; // No required fields in step 3
      case 4:
        return ['goal', 'consent'] as const;
      default:
        return [] as const;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      nextStep();
    } else {
      toast.error('必須項目を入力してください');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error('入力内容に不備があります。確認してください。');
        return;
      }

      const formData = form.getValues();
      const result = await submitIntakeForm(formData);
      
      setSubmitResult(result);
      
      if (result.success) {
        toast.success('問診フォームを送信しました');
        clearStorage();
      } else {
        toast.error(result.message || '送信中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitResult({
        success: false,
        message: 'ネットワークエラーが発生しました。もう一度お試しください。',
      });
      toast.error('送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            submitResult={submitResult}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (!isLoaded) return true;
    if (currentStep === 5) return false;
    
    const stepFields = getStepFields(currentStep);
    const watchedValues = form.watch(stepFields);
    
    return stepFields.some(field => {
      const value = watchedValues[stepFields.indexOf(field)];
      return value === undefined || value === null || value === '' || value === false;
    });
  };

  const getNextLabel = () => {
    if (currentStep === 5) return '送信';
    return '次へ';
  };

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

  return (
    <Form {...form}>
      <form>
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
        >
          {renderCurrentStep()}
        </StepShell>
      </form>
    </Form>
  );
}