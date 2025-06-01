import React from 'react';
import { DocumentIcon, UserIcon, MessageCircleIcon, CheckIcon, PlayIcon } from './Icons';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { 
    number: 1, 
    title: 'Content Strategy', 
    description: 'Define topic & key messages',
    icon: DocumentIcon,
    color: 'from-blue-500 to-purple-600'
  },
  { 
    number: 2, 
    title: 'Characters', 
    description: 'Create video characters',
    icon: UserIcon,
    color: 'from-purple-500 to-blue-600'
  },
  { 
    number: 3, 
    title: 'Dialogue', 
    description: 'Generate script dialogue',
    icon: MessageCircleIcon,
    color: 'from-green-500 to-blue-600'
  },
  { 
    number: 4, 
    title: 'Final Script', 
    description: 'Complete video prompt',
    icon: PlayIcon,
    color: 'from-orange-500 to-red-600'
  },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Script Creation Process</h2>
        <p className="text-gray-600">Follow these 4 steps to create your professional video script</p>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const IconComponent = step.icon;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25'
                      : status === 'active'
                      ? `bg-gradient-to-r ${step.color} shadow-lg shadow-blue-500/25 ring-4 ring-blue-100`
                      : 'bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckIcon className="text-white" size={24} />
                  ) : (
                    <IconComponent 
                      className={status === 'active' ? 'text-white' : 'text-gray-400'} 
                      size={24} 
                    />
                  )}
                  
                  {/* Step Number Badge */}
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      status === 'completed'
                        ? 'bg-green-600 text-white'
                        : status === 'active'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.number}
                  </div>
                </div>
                
                {/* Step Info */}
                <div className="mt-4 text-center max-w-[120px]">
                  <div 
                    className={`text-sm font-semibold ${
                      status === 'active' 
                        ? 'text-gray-900' 
                        : status === 'completed'
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div 
                    className={`text-xs mt-1 ${
                      status === 'active' 
                        ? 'text-gray-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${
                        step.number < currentStep 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full' 
                          : 'w-0'
                      }`}
                    />
                  </div>
                  
                  {/* Animated Progress Dots */}
                  {step.number < currentStep && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="text-sm text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};