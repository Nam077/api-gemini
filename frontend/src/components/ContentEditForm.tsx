import React from 'react';
import type { ContentData } from '../services/api';
import EditableList from './EditableList';
import { SaveIcon } from './Icons';

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

export default ContentEditForm; 