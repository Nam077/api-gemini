import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { useVideoScriptGeneration } from '../hooks/useVideoScriptGeneration';
import { 
  PlayIcon, 
  LoadingSpinner, 
  ArrowLeftIcon, 
  RefreshIcon,
  CheckIcon,
  DocumentIcon,
  UserIcon,
  MessageCircleIcon,
  ClockIcon,
  CopyIcon
} from './Icons';

export const FinalScriptStep: React.FC = () => {
  const {
    generateFinalScript,
    contentData,
    characters,
    dialogue,
    finalScript,
    isGeneratingFinalScript,
    finalScriptError,
    setCurrentStep,
    resetAll,
  } = useVideoScriptGeneration();

  const [copyStates, setCopyStates] = useState<{[key: string]: boolean}>({});

  const handleGenerateFinalScript = async () => {
    if (!contentData || characters.length === 0 || dialogue.length === 0) return;

    try {
      const input = {
        contentData,
        characters,
        dialogue,
      };
      
      await generateFinalScript(input);
    } catch (error) {
      console.error('Failed to generate final script:', error);
    }
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? All progress will be lost.')) {
      resetAll();
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      const success = copy(text);
      if (success) {
        setCopyStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopyStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
      } else {
        console.error('Failed to copy text');
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!contentData || characters.length === 0 || dialogue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <PlayIcon className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Prerequisites Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please complete Steps 1-3 first to generate content, characters, and dialogue.
          </p>
          <button 
            onClick={handleBack} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon size={20} />
            Back to Dialogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mb-4">
          <PlayIcon className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Final Script Generation
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Generate your complete AI video production prompt and script summary
        </p>
      </div>

      {/* Project Metadata */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <DocumentIcon className="text-white" size={18} />
          </div>
          Project Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Topic</p>
            <p className="text-sm font-semibold text-gray-900">{contentData.topic}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Duration</p>
            <p className="text-sm font-semibold text-gray-900">{contentData.duration}</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Characters</p>
            <p className="text-sm font-semibold text-gray-900">{characters.length} character{characters.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Language</p>
            <p className="text-sm font-semibold text-gray-900">{contentData.language}</p>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-xl">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Scenes</p>
            <p className="text-sm font-semibold text-gray-900">{dialogue.length} scene{dialogue.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Project Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <CheckIcon className="text-green-600" size={24} />
            Project Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <DocumentIcon className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-800">Topic</span>
              </div>
              <p className="text-gray-900">{contentData.topic}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="text-purple-600" size={20} />
                <span className="font-semibold text-gray-800">Characters</span>
              </div>
              <p className="text-gray-900">{characters.length} character(s)</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircleIcon className="text-green-600" size={20} />
                <span className="font-semibold text-gray-800">Dialogue</span>
              </div>
              <p className="text-gray-900">{dialogue.length} segment(s)</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <ClockIcon className="text-orange-600" size={20} />
                <span className="font-semibold text-gray-800">Duration</span>
              </div>
              <p className="text-gray-900">{contentData.duration}s</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <span className="font-semibold text-gray-800">Tone:</span>
              <p className="text-gray-900 capitalize">{contentData.tone}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-pink-100">
              <span className="font-semibold text-gray-800">Audience:</span>
              <p className="text-gray-900">{contentData.targetAudience}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {finalScriptError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm">{finalScriptError}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={handleBack} 
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon size={20} />
              Back
            </button>
            <button
              onClick={handleGenerateFinalScript}
              disabled={isGeneratingFinalScript}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isGeneratingFinalScript ? (
                <>
                  <LoadingSpinner size={20} />
                  Generating Final Script...
                </>
              ) : (
                <>
                  <PlayIcon size={20} />
                  Generate Final Script & AI Video Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Final Script Display */}
      {finalScript && (
        <div className="space-y-8">
          {/* Script Metadata */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckIcon className="text-white" size={20} />
                </div>
                Script Generated Successfully!
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Script ID:</span>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                      {finalScript.scriptId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Title:</span>
                    <p className="text-gray-900">{finalScript.metadata.title}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Created:</span>
                    <p className="text-gray-900">
                      {new Date(finalScript.metadata.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Duration:</span>
                    <p className="text-gray-900">{finalScript.metadata.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Video Generation Prompt */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🤖</span>
                  </div>
                  AI Video Generation Prompt
                </h3>
                <button
                  onClick={() => copyToClipboard(finalScript.prompt, 'prompt')}
                  className="group bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <CopyIcon size={16} />
                  {copyStates['prompt'] ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {finalScript.prompt}
                </p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  This prompt is optimized for AI video generation tools like Runway ML, Pika Labs, Sora, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Script Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <DocumentIcon className="text-purple-600" size={24} />
                Complete Script Summary
              </h3>
            </div>
            <div className="p-8 space-y-8">
              {/* Characters */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <UserIcon className="text-blue-600" size={20} />
                  Characters ({finalScript.characters.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finalScript.characters.map((character) => (
                    <div key={character.characterId} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{character.name.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{character.name}</span>
                          <span className="text-gray-600 ml-2">({character.role})</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{character.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dialogue Timeline */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageCircleIcon className="text-green-600" size={20} />
                  Dialogue Timeline ({finalScript.dialogue.length} segments)
                </h4>
                <div className="space-y-4">
                  {finalScript.dialogue.map((segment, index) => (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {segment.timestamp}
                        </span>
                        <span className="font-semibold text-gray-900">{segment.characterName}</span>
                        <span className="text-gray-600 text-sm">({segment.emotion})</span>
                      </div>
                      <p className="text-gray-800 mb-3 italic">"{segment.dialogue}"</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">Action:</span> {segment.action}
                        </div>
                        {segment.visualCue && (
                          <div>
                            <span className="font-medium">Visual:</span> {segment.visualCue}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => copyToClipboard(JSON.stringify(finalScript, null, 2), 'json')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <CopyIcon size={20} />
                {copyStates['json'] ? 'Copied!' : 'Copy Complete Script (JSON)'}
              </button>
              <button
                onClick={handleStartOver}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshIcon size={20} />
                Start New Project
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-gray-500">💾</span>
                Save your script data before starting a new project!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};