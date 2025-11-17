'use client';

import { CheckIcon } from '@heroicons/react/24/solid';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-start justify-center">
        {steps.map((stepName, stepIdx) => {
          const stepNumber = stepIdx + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={stepName} className="relative flex-1 px-4">
              <div className="flex flex-col items-center gap-2">
                {stepIdx < steps.length - 1 && (
                  <div
                    className="absolute left-1/2 top-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-300"
                    aria-hidden="true"
                  />
                )}

                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                        ? 'border-2 border-primary bg-white'
                        : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className={`${isCurrent ? 'text-primary' : 'text-gray-500'} font-semibold text-sm`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
                <p
                  className={`text-center text-sm font-medium ${isCurrent ? 'text-primary' : 'text-gray-500'}`}
                >
                  {stepName}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
