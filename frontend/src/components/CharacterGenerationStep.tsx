import React, { useState } from 'react';
import { useVideoScriptGeneration } from '../hooks/useVideoScriptGeneration';
import CharacterCard from './CharacterCard';
import { 
  UserIcon, 
  PlusIcon, 
  LoadingSpinner, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckIcon 
} from './Icons';

export const CharacterGenerationStep: React.FC = () => {
  const {
    generateCharacter,
    contentData,
    characters,
    isGeneratingCharacter,
    characterError,
    setCurrentStep,
    removeCharacter,
    updateCharacter,
  } = useVideoScriptGeneration();

  const [characterPrompt, setCharacterPrompt] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleGenerateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentData) return;

    try {
      const input = {
        contentData,
        characterPrompt: characterPrompt || undefined,
        existingCharacters: characters,
      };
      
      await generateCharacter(input);
      setCharacterPrompt(''); // Clear form after successful generation
    } catch (error) {
      console.error('Failed to generate character:', error);
    }
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  if (!contentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Content Strategy Required
          </h2>
          <p className="text-gray-600 mb-6">Please complete Step 1 first to generate content strategy.</p>
          <button 
            onClick={handleBack} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon size={20} />
            Back to Content Strategy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl mb-4">
          <UserIcon className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Character Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create compelling characters that bring your content to life with AI-powered personality and appearance design
        </p>
      </div>

      {/* Content Context Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-700">Topic:</span>
              <span className="text-blue-900">{contentData.topic}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700">Tone:</span>
              <span className="text-purple-900 capitalize">{contentData.tone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-green-700">Duration:</span>
              <span className="text-green-900">{contentData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-orange-700">Language:</span>
              <span className="text-orange-900">{contentData.language}</span>
            </div>
          </div>
        </div>

        {/* Character Generation Form */}
        <form onSubmit={handleGenerateCharacter} className="p-8 space-y-6">
          <div>
            <label htmlFor="characterPrompt" className="block text-sm font-semibold text-gray-700 mb-2">
              Character Description (Optional)
            </label>
            <textarea
              id="characterPrompt"
              value={characterPrompt}
              onChange={(e) => setCharacterPrompt(e.target.value)}
              placeholder={
                contentData.language === 'English' 
                  ? "e.g., Create a friendly female tech expert in her 30s, professional but approachable, wearing modern business attire..."
                  : contentData.language === 'Chinese'
                  ? "例如：创建一个友好的30多岁女性技术专家，专业但平易近人，穿着现代商务装..."
                  : "ví dụ: Tạo một nữ chuyên gia công nghệ thân thiện 30 tuổi, chuyên nghiệp nhưng dễ gần, mặc trang phục công sở hiện đại..."
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 resize-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for AI to auto-generate a suitable character based on your content strategy and selected language ({contentData.language}).
            </p>
          </div>

          {/* Error Display */}
          {characterError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">{characterError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleBack} 
              type="button" 
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon size={20} />
              Back
            </button>
            
            <button
              type="submit"
              disabled={isGeneratingCharacter}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isGeneratingCharacter ? (
                <>
                  <LoadingSpinner size={20} />
                  Generating Character...
                </>
              ) : (
                <>
                  <PlusIcon size={20} />
                  Generate New Character
                </>
              )}
            </button>
            
            {characters.length > 0 && (
              <button
                type="button"
                onClick={handleNext}
                className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                Continue to Dialogue
                <ArrowRightIcon size={20} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Generated Characters */}
      {characters.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckIcon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Generated Characters ({characters.length})
                </h3>
                <p className="text-gray-600">
                  Your AI-powered characters are ready for dialogue generation
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {characters.map((character, index) => (
                <CharacterCard
                  key={character.characterId}
                  character={character}
                  index={index}
                  isEditing={editingIndex === index}
                  onEdit={() => setEditingIndex(index)}
                  onSave={(updatedCharacter) => {
                    updateCharacter(index, updatedCharacter);
                    setEditingIndex(null);
                  }}
                  onCancel={() => setEditingIndex(null)}
                  onRemove={() => removeCharacter(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};