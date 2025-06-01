import React, { useState } from 'react';
import { useVideoScriptGeneration } from '../hooks/useVideoScriptGeneration';
import type { DialogueSegment } from '../services/api';
import DialogueSegmentCard from './DialogueSegmentCard';
import DialogueChatView from './DialogueChatView';
import { 
  MessageCircleIcon, 
  LoadingSpinner, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckIcon,
  RefreshIcon,
  ListIcon,
  MessageSquareIcon,
  CloseIcon
} from './Icons';

export const DialogueGenerationStep: React.FC = () => {
  const {
    generateDialogue,
    contentData,
    characters,
    dialogue,
    isGeneratingDialogue,
    dialogueError,
    setCurrentStep,
    setDialogue,
  } = useVideoScriptGeneration();

  const [formData, setFormData] = useState({
    dialoguePrompt: '',
    dialogueCount: 5,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chat' | 'list'>('chat');
  
  // Thay đổi logic: dùng mảng scenes và index
  const [scenes, setScenes] = useState<DialogueSegment[][]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isGeneratingNextScene, setIsGeneratingNextScene] = useState(false);

  // Computed values
  const currentScene = scenes[currentSceneIndex] || [];
  const hasScenes = scenes.length > 0;

  const handleGenerateDialogue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentData || characters.length === 0) return;

    try {
      const input = {
        contentData,
        characters,
        dialoguePrompt: formData.dialoguePrompt || undefined,
        dialogueCount: formData.dialogueCount,
      };
      
      await generateDialogue(input);
    } catch (error) {
      console.error('Failed to generate dialogue:', error);
    }
  };

  const handleGenerateNextScene = async () => {
    if (!contentData || characters.length === 0) return;

    setIsGeneratingNextScene(true);
    
    try {
      // Lấy existingDialogues từ scene hiện tại nếu có
      const existingDialogues = hasScenes ? currentScene : dialogue;
      
      const input = {
        contentData,
        characters,
        dialoguePrompt: formData.dialoguePrompt || `Tạo cảnh kế tiếp dựa trên cảnh trước`,
        dialogueCount: formData.dialogueCount,
        existingDialogues: existingDialogues,
      };
      
      await generateDialogue(input);
    } catch (error) {
      console.error('Failed to generate next scene:', error);
      setIsGeneratingNextScene(false); // Chỉ reset khi có lỗi
    }
  };

  const handleSelectScene = (index: number) => {
    setCurrentSceneIndex(index);
  };

  const handleClearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả scenes? Hành động này không thể hoàn tác.')) {
      setScenes([]);
      setCurrentSceneIndex(0);
      setDialogue([]);
    }
  };

  const handleDeleteScene = (sceneIndex: number) => {
    if (confirm(`Bạn có chắc muốn xóa Scene ${sceneIndex + 1}?`)) {
      const newScenes = scenes.filter((_, index) => index !== sceneIndex);
      setScenes(newScenes);
      
      // Adjust currentSceneIndex if necessary
      if (newScenes.length === 0) {
        setCurrentSceneIndex(0);
        setDialogue([]);
      } else {
        // If deleted scene was current or after current, adjust index
        if (sceneIndex <= currentSceneIndex) {
          const newIndex = Math.max(0, currentSceneIndex - 1);
          setCurrentSceneIndex(newIndex);
          setDialogue(newScenes[newIndex] || []);
        }
      }
    }
  };

  const handleNext = () => {
    // Lấy scene được chọn để đưa vào final step
    const selectedScene = hasScenes ? currentScene : dialogue;
    setDialogue(selectedScene);
    setCurrentStep(4);
  };

  // Update scenes khi dialogue thay đổi
  React.useEffect(() => {
    if (dialogue.length > 0) {
      if (!hasScenes) {
        // Scene đầu tiên
        setScenes([dialogue]);
        setCurrentSceneIndex(0);
      } else {
        // Nếu đang generate next scene, thêm scene mới
        if (isGeneratingNextScene) {
          setScenes(prev => [...prev, dialogue]);
          setCurrentSceneIndex(scenes.length); // Chuyển đến scene mới
          setIsGeneratingNextScene(false); // Reset flag sau khi thêm scene
        } else {
          // Update scene hiện tại
          setScenes(prev => prev.map((scene, index) => 
            index === currentSceneIndex ? dialogue : scene
          ));
        }
      }
    }
  }, [dialogue]);

  const handleBack = () => {
    setCurrentStep(2);
  };

  const updateDialogueSegment = (index: number, updatedSegment: DialogueSegment) => {
    if (hasScenes) {
      // Update trong scenes array
      setScenes(prev => prev.map((scene, sceneIndex) => 
        sceneIndex === currentSceneIndex 
          ? scene.map((segment, segmentIndex) => 
              segmentIndex === index ? updatedSegment : segment
            )
          : scene
      ));
      
      // Update dialogue state để sync với UI
      const updatedDialogue = currentScene.map((segment, i) => 
        i === index ? updatedSegment : segment
      );
      setDialogue(updatedDialogue);
    } else {
      // Fallback cho trường hợp chưa có scenes
      const updatedDialogue = dialogue.map((segment, i) => 
        i === index ? updatedSegment : segment
      );
      setDialogue(updatedDialogue);
    }
    setEditingIndex(null);
  };

  if (!contentData || characters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageCircleIcon className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Prerequisites Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please complete Steps 1 & 2 first to generate content strategy and characters.
          </p>
          <button 
            onClick={handleBack} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon size={20} />
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mb-4">
          <MessageCircleIcon className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dialogue Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create engaging dialogue scripts with precise timing, emotions, and visual cues for professional video production
        </p>
      </div>

      {/* Content Context Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content & Character Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Content Strategy</h4>
              <div className="space-y-2 text-sm">
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
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Characters ({characters.length})</h4>
              <div className="space-y-1 text-sm">
                {characters.map((char, index) => (
                  <div key={char.characterId} className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{char.name}</span>
                    <span className="text-gray-500">({char.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dialogue Generation Form */}
        <form onSubmit={handleGenerateDialogue} className="p-8 space-y-6">
          <div>
            <label htmlFor="dialoguePrompt" className="block text-sm font-semibold text-gray-700 mb-2">
              Dialogue Instructions (Optional)
            </label>
            <textarea
              id="dialoguePrompt"
              value={formData.dialoguePrompt}
              onChange={(e) => setFormData({ ...formData, dialoguePrompt: e.target.value })}
              placeholder={
                contentData.language === 'English'
                  ? "e.g., Focus on problem-solution conversation, make the customer ask specific questions about pricing, include emotional reactions..."
                  : contentData.language === 'Chinese'
                  ? "例如：重点关注问题解决对话，让客户询问具体价格问题，包含情感反应..."
                  : "ví dụ: Tập trung vào cuộc trò chuyện giải quyết vấn đề, khách hàng hỏi về giá cả cụ thể, bao gồm phản ứng cảm xúc..."
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 h-24 resize-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify how you want the dialogue to flow. Leave empty for AI to auto-generate based on content strategy and characters in {contentData.language}.
            </p>
          </div>

          <div>
            <label htmlFor="dialogueCount" className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Dialogue Segments
            </label>
            <select
              id="dialogueCount"
              value={formData.dialogueCount}
              onChange={(e) => setFormData({ ...formData, dialogueCount: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>
                  {num} segments
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              More segments = more detailed script, but ensure it fits your video duration.
            </p>
          </div>

          {/* Error Display */}
          {dialogueError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">{dialogueError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button 
              onClick={handleBack} 
              type="button" 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon size={18} />
              Back
            </button>
            
            <button
              type="submit"
              disabled={isGeneratingDialogue}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isGeneratingDialogue ? (
                <>
                  <LoadingSpinner size={18} />
                  Generating...
                </>
              ) : dialogue.length > 0 ? (
                <>
                  <RefreshIcon size={18} />
                  Regenerate
                </>
              ) : (
                <>
                  <MessageCircleIcon size={18} />
                  Generate Dialogue
                </>
              )}
            </button>

            {/* Tạo cảnh kế tiếp button */}
            {(hasScenes || dialogue.length > 0) && (
              <button
                type="button"
                onClick={handleGenerateNextScene}
                disabled={isGeneratingNextScene}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isGeneratingNextScene ? (
                  <>
                    <LoadingSpinner size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageCircleIcon size={18} />
                    Next Scene
                  </>
                )}
              </button>
            )}
            
            {(hasScenes || dialogue.length > 0) && (
              <button
                type="button"
                onClick={handleNext}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                Continue
                <ArrowRightIcon size={18} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Generated Dialogue */}
      {(hasScenes || dialogue.length > 0) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckIcon className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Dialogue Script ({(hasScenes ? currentScene : dialogue).length} segments)
                    {hasScenes && (
                      <span className="text-sm text-purple-600 font-normal ml-2">
                        • Scene {currentSceneIndex + 1}/{scenes.length}
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600">
                    {hasScenes ? 
                      `Viewing Scene ${currentSceneIndex + 1}. Use scene management above to switch or create new scenes.` :
                      "Your AI-powered dialogue script is ready for compilation"
                    }
                  </p>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('chat')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    viewMode === 'chat'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquareIcon size={16} />
                  Chat View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListIcon size={16} />
                  List View
                </button>
              </div>
            </div>

            {/* Scene Navigation - Compact Design */}
            {hasScenes && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Scene Management:</span>
                    
                    {/* Scene Selector Dropdown */}
                    <select
                      value={currentSceneIndex}
                      onChange={(e) => handleSelectScene(parseInt(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      {scenes.map((_, index) => (
                        <option key={index} value={index}>
                          Scene {index + 1} ({scenes[index].length} segments)
                        </option>
                      ))}
                    </select>

                    {/* Quick Scene Info */}
                    <div className="text-sm text-gray-600">
                      ({scenes.length} scene{scenes.length > 1 ? 's' : ''} • {scenes.reduce((total, scene) => total + scene.length, 0)} total segments)
                    </div>
                  </div>
                  
                  {/* Scene Actions */}
                  <div className="flex items-center gap-2">
                    {scenes.length > 1 && (
                      <button
                        onClick={() => handleDeleteScene(currentSceneIndex)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        title="Xóa scene hiện tại"
                      >
                        <CloseIcon size={14} />
                        Delete
                      </button>
                    )}
                    
                    <button
                      onClick={handleClearAll}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      title="Xóa tất cả scenes"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Scene Preview Pills (First 5 scenes) */}
                {scenes.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {scenes.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectScene(index)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          index === currentSceneIndex
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    {scenes.length > 5 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{scenes.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8">
            {viewMode === 'chat' ? (
              <DialogueChatView
                dialogue={hasScenes ? currentScene : dialogue}
                characters={characters}
                onEditSegment={updateDialogueSegment}
              />
            ) : (
              <div className="space-y-6">
                {(hasScenes ? currentScene : dialogue).map((segment, index) => (
                  <DialogueSegmentCard
                    key={index}
                    segment={segment}
                    index={index}
                    characters={characters}
                    isEditing={editingIndex === index}
                    onEdit={() => setEditingIndex(index)}
                    onSave={(updatedSegment) => updateDialogueSegment(index, updatedSegment)}
                    onCancel={() => setEditingIndex(null)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Scenes Overview */}
      {hasScenes && scenes.length > 1 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Scenes Overview ({scenes.length} scenes)
              </h3>
              <div className="text-sm text-gray-600">
                Total: {scenes.reduce((total, scene) => total + scene.length, 0)} segments
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {scenes.map((scene, sceneIndex) => (
                <div 
                  key={sceneIndex}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    sceneIndex === currentSceneIndex 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                  onClick={() => handleSelectScene(sceneIndex)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Scene {sceneIndex + 1}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{scene.length} segments</span>
                      {scenes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(sceneIndex);
                          }}
                          className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                          title={`Xóa Scene ${sceneIndex + 1}`}
                        >
                          <CloseIcon size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Scene Preview */}
                  <div className="space-y-1">
                    {scene.slice(0, 2).map((segment, segmentIndex) => (
                      <div key={segmentIndex} className="text-xs text-gray-600 truncate">
                        <span className="font-medium">{segment.characterName}:</span> {segment.dialogue}
                      </div>
                    ))}
                    {scene.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{scene.length - 2} more segments...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleGenerateNextScene}
                    disabled={isGeneratingNextScene}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isGeneratingNextScene ? (
                      <>
                        <LoadingSpinner size={18} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <MessageCircleIcon size={18} />
                        Create New Scene
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleClearAll}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <RefreshIcon size={18} />
                    Clear All Scenes
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeftIcon size={18} />
                    Back to Characters
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    Continue to Final Script
                    <ArrowRightIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};