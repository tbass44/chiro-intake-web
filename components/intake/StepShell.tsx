import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { ArrowLeft, ArrowRight, Save, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

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
}: StepShellProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">カイロシガ整体院</h1>
                <p className="text-sm text-blue-600">初回AI問診フォーム</p>
              </div>
            </div>
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
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          onStepClick={onStepChange}
        />

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-blue-100 text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {children}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
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

          <div className="text-sm text-gray-500">
            {currentStep} / {totalSteps}
          </div>

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

        {/* Mobile save indicator */}
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