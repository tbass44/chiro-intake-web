import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ 
  currentStep, 
  totalSteps, 
  stepLabels,
  onStepClick 
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Mobile: Simple progress bar */}
      <div className="md:hidden">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>ステップ {currentStep}</span>
          <span>{currentStep} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm font-medium text-gray-700 mt-2">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Desktop: Full step indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isClickable = stepNumber <= currentStep && onStepClick;

            return (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => isClickable && onStepClick(stepNumber)}
                    disabled={!isClickable}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                      {
                        'bg-blue-600 text-white': isCurrent,
                        'bg-green-600 text-white': isCompleted,
                        'bg-gray-200 text-gray-500': !isCurrent && !isCompleted,
                        'cursor-pointer hover:scale-105': isClickable,
                        'cursor-not-allowed': !isClickable,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </button>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium text-center max-w-20',
                      {
                        'text-blue-600': isCurrent,
                        'text-green-600': isCompleted,
                        'text-gray-500': !isCurrent && !isCompleted,
                      }
                    )}
                  >
                    {label}
                  </span>
                </div>
                {stepNumber < totalSteps && (
                  <div className="flex-1 h-px bg-gray-200 mx-4 mt-5">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        isCompleted ? 'bg-green-600' : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}