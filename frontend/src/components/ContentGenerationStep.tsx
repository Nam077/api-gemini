import React, { useState } from 'react';
import { useVideoScriptGeneration } from '../hooks/useVideoScriptGeneration';
import type { ContentData } from '../services/api';
import { Modal } from './Modal';
import { 
  DocumentIcon, 
  EditIcon, 
  SaveIcon, 
  RefreshIcon, 
  LoadingSpinner, 
  ArrowRightIcon,
  CheckIcon 
} from './Icons';
import EditableList from './EditableList';

export const ContentGenerationStep: React.FC = () => {
  const {
    generateContent,
    contentData,
    isGeneratingContent,
    contentError,
    setCurrentStep,
    setContentData,
  } = useVideoScriptGeneration();

  const [formData, setFormData] = useState({
    topic: '',
    duration: '8',
    tags: '',
    language: 'Vietnamese',
    customLanguage: '',
    customDuration: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContentData, setEditedContentData] = useState<ContentData | null>(null);

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) return;

    try {
      const finalLanguage = formData.language === 'Custom' ? formData.customLanguage : formData.language;
      const finalDuration = formData.duration === 'Custom' ? formData.customDuration : formData.duration;
      
      if (formData.language === 'Custom' && !formData.customLanguage.trim()) {
        alert('Please enter a custom language');
        return;
      }
      
      if (formData.duration === 'Custom' && (!formData.customDuration || parseInt(formData.customDuration) < 1)) {
        alert('Please enter a valid custom duration');
        return;
      }

      const input = {
        topic: formData.topic,
        duration: `${finalDuration}s`,
        language: finalLanguage,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
      };
      
      await generateContent(input);
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const handleEditContent = () => {
    setEditedContentData(contentData);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editedContentData) {
      setContentData(editedContentData);
      setIsEditModalOpen(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
          <DocumentIcon className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Strategy Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create compelling video content strategies with AI-powered insights and structured planning
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <DocumentIcon className="text-blue-600" size={24} />
            Step 1: Define Your Content Strategy
          </h2>
          <p className="text-gray-600 mt-1">
            Provide details about your video to generate a comprehensive content strategy
          </p>
        </div>

        <form onSubmit={handleGenerateContent} className="p-8 space-y-6">
          {/* Topic & Duration Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
                Video Topic *
              </label>
              <input
                id="topic"
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., How to start a successful online business"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your topic for better content strategy
              </p>
            </div>
            
            {/* Language Selection */}
            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                Language / Ngôn ngữ
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value, customLanguage: '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Vietnamese">🇻🇳 Vietnamese / Tiếng Việt</option>
                <option value="English">🇺🇸 English</option>
                <option value="Chinese">🇨🇳 Chinese / 中文</option>
                <option value="Japanese">🇯🇵 Japanese / 日本語</option>
                <option value="Korean">🇰🇷 Korean / 한국어</option>
                <option value="Spanish">🇪🇸 Spanish / Español</option>
                <option value="French">🇫🇷 French / Français</option>
                <option value="German">🇩🇪 German / Deutsch</option>
                <option value="Custom">🌍 Custom Language</option>
              </select>
              {formData.language === 'Custom' && (
                <input
                  type="text"
                  value={formData.customLanguage}
                  onChange={(e) => setFormData({ ...formData, customLanguage: e.target.value })}
                  placeholder="Enter your language (e.g., Italian, Portuguese, Thai...)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mt-2"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Choose the language for your video content generation
              </p>
            </div>

            {/* Duration Selection */}
            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                Video Duration
              </label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value, customDuration: '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="8">8 seconds (Ultra Short)</option>
                <option value="9">9 seconds (Ultra Short)</option>
                <option value="15">15 seconds (Short)</option>
                <option value="30">30 seconds (Medium)</option>
                <option value="60">60 seconds (Standard)</option>
                <option value="90">90 seconds (Long)</option>
                <option value="120">2 minutes (Extended)</option>
                <option value="180">3 minutes</option>
                <option value="300">5 minutes</option>
                <option value="Custom">⏱️ Custom Duration</option>
              </select>
              {formData.duration === 'Custom' && (
                <input
                  type="number"
                  value={formData.customDuration}
                  onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                  placeholder="Enter duration in seconds (e.g., 45, 150, 240...)"
                  min="1"
                  max="3600"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mt-2"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.duration === 'Custom' 
                  ? 'Enter any duration from 1 second to 1 hour (3600s)'
                  : 'Choose video duration or select custom for any length'
                }
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., business, entrepreneurship, startup"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas to categorize your content
            </p>
          </div>

          {/* Error Display */}
          {contentError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">{contentError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isGeneratingContent}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isGeneratingContent ? (
                <>
                  <LoadingSpinner size={20} />
                  Generating Strategy...
                </>
              ) : contentData ? (
                <>
                  <RefreshIcon size={20} />
                  Regenerate Strategy
                </>
              ) : (
                <>
                  <DocumentIcon size={20} />
                  Generate Content Strategy
                </>
              )}
            </button>
            
            {contentData && (
              <button
                type="button"
                onClick={handleNext}
                className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
              >
                Continue to Characters
                <ArrowRightIcon size={20} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Generated Content Display */}
      {contentData && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckIcon className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Generated Content Strategy
                  </h3>
                  <p className="text-gray-600">
                    Your AI-powered content strategy is ready for review
                  </p>
                </div>
              </div>
              <button
                onClick={handleEditContent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <EditIcon size={16} />
                Edit Strategy
              </button>
            </div>
          </div>

          <div className="p-8">
            <ContentDataDisplay contentData={contentData} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Content Strategy"
        maxWidth="max-w-4xl"
      >
        {editedContentData && (
          <ContentEditForm
            contentData={editedContentData}
            onChange={setEditedContentData}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

// Content Display Component
interface ContentDataDisplayProps {
  contentData: ContentData;
}

const ContentDataDisplay: React.FC<ContentDataDisplayProps> = ({ contentData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Topic & Duration</h4>
          <p className="text-blue-800 font-medium">{contentData.topic}</p>
          <p className="text-blue-700 text-sm mt-1">{contentData.duration} seconds</p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4">
          <h4 className="font-semibold text-purple-900 mb-2">Target Audience</h4>
          <p className="text-purple-800">{contentData.targetAudience}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-2">Content Tone</h4>
          <p className="text-green-800 capitalize">{contentData.tone}</p>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4">
          <h4 className="font-semibold text-orange-900 mb-2">Main Message</h4>
          <p className="text-orange-800">{contentData.mainMessage}</p>
        </div>
      </div>
    </div>

    {contentData.tags && contentData.tags.length > 0 && (
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {contentData.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}

    {contentData.keyPoints && contentData.keyPoints.length > 0 && (
      <div className="bg-indigo-50 rounded-xl p-6">
        <h4 className="font-semibold text-indigo-900 mb-3">Key Points</h4>
        <ul className="space-y-2">
          {contentData.keyPoints.map((point: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-800 text-xs font-semibold">{index + 1}</span>
              </div>
              <p className="text-indigo-800">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Content Edit Form Component
interface ContentEditFormProps {
  contentData: ContentData;
  onChange: (data: ContentData) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ContentEditForm: React.FC<ContentEditFormProps> = ({
  contentData,
  onChange,
  onSave,
  onCancel,
}) => {
  const handleFieldChange = (field: keyof ContentData, value: string | string[]) => {
    onChange({ ...contentData, [field]: value });
  };

  const handleKeyPointsChange = (keyPoints: string[]) => {
    handleFieldChange('keyPoints', keyPoints);
  };

  const handleTagsChange = (tags: string[]) => {
    handleFieldChange('tags', tags);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Topic
          </label>
          <input
            value={contentData.topic}
            onChange={(e) => handleFieldChange('topic', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration (seconds)
          </label>
          <input
            value={contentData.duration}
            onChange={(e) => handleFieldChange('duration', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Target Audience
        </label>
        <textarea
          value={contentData.targetAudience || ''}
          onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
          placeholder="Describe your target audience..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content Tone
        </label>
        <textarea
          value={contentData.tone || ''}
          onChange={(e) => handleFieldChange('tone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
          placeholder="Describe the tone and style..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Main Message
        </label>
        <textarea
          value={contentData.mainMessage || ''}
          onChange={(e) => handleFieldChange('mainMessage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
          placeholder="What's the core message you want to convey?"
        />
      </div>

      <div>
        <EditableList
          items={Array.isArray(contentData.keyPoints) ? contentData.keyPoints : []}
          onChange={handleKeyPointsChange}
          label="Key Points"
          placeholder="Add a key point..."
          addButtonText="Add Point"
        />
      </div>

      <div>
        <EditableList
          items={Array.isArray(contentData.tags) ? contentData.tags : []}
          onChange={handleTagsChange}
          label="Tags"
          placeholder="Add a tag..."
          addButtonText="Add Tag"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <SaveIcon size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
};