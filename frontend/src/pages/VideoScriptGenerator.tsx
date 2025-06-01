import React from 'react';
import { useVideoScriptGeneration } from '../hooks/useVideoScriptGeneration';
import { ContentGenerationStep } from '../components/ContentGenerationStep';
import { CharacterGenerationStep } from '../components/CharacterGenerationStep';
import { DialogueGenerationStep } from '../components/DialogueGenerationStep';
import { FinalScriptStep } from '../components/FinalScriptStep';
import { StepIndicator } from '../components/StepIndicator';
import { RefreshIcon } from '../components/Icons';

export const VideoScriptGenerator: React.FC = () => {
  const { currentStep, resetAll } = useVideoScriptGeneration();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ContentGenerationStep />;
      case 2:
        return <CharacterGenerationStep />;
      case 3:
        return <DialogueGenerationStep />;
      case 4:
        return <FinalScriptStep />;
      default:
        return <ContentGenerationStep />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Script Generator</h1>
          <p className="text-gray-600 mt-2">Create professional video scripts in 4 simple steps</p>
        </div>
        
        <button
          onClick={resetAll}
          className="group bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3 font-semibold"
        >
          <RefreshIcon size={18} className="group-hover:rotate-180 transition-transform duration-300" />
          New Project
        </button>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      
      {/* Current Step Content */}
      <div className="transform transition-all duration-500 ease-out">
        {renderCurrentStep()}
      </div>
    </div>
  );
}; 