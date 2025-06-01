import React, { useState } from 'react';
import type { DialogueSegment, CharacterData } from '../services/api';
import { EditIcon, CloseIcon, CheckIcon } from './Icons';

interface DialogueSegmentCardProps {
  segment: DialogueSegment;
  index: number;
  characters: CharacterData[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: (segment: DialogueSegment) => void;
  onCancel: () => void;
}

const DialogueSegmentCard: React.FC<DialogueSegmentCardProps> = ({
  segment,
  index,
  characters,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [editedSegment, setEditedSegment] = useState(segment);

  const handleSave = () => {
    onSave(editedSegment);
  };

  const handleCancel = () => {
    setEditedSegment(segment); // Reset to original
    onCancel();
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {segment.timestamp}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{segment.characterName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{segment.characterName}</p>
                  <p className="text-sm text-green-600 capitalize">{segment.emotion}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Dialogue"
            >
              <EditIcon size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Dialogue</h5>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900 text-base leading-relaxed italic">
                "{segment.dialogue}"
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Action</h5>
              <p className="text-gray-800 text-sm leading-relaxed bg-orange-50 rounded-lg p-3">
                {segment.action}
              </p>
            </div>
            
            {segment.visualCue && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Visual Cue</h5>
                <p className="text-gray-800 text-sm leading-relaxed bg-purple-50 rounded-lg p-3">
                  {segment.visualCue}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-300 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-blue-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <EditIcon className="text-white" size={16} />
            </div>
            <h4 className="text-lg font-bold text-blue-900">
              Editing Dialogue Segment {index + 1}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <CheckIcon size={14} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <CloseIcon size={14} />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Timestamp *
            </label>
            <input
              value={editedSegment.timestamp}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, timestamp: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0:00-0:10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Character *
            </label>
            <select
              value={editedSegment.characterName}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, characterName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {characters.map(char => (
                <option key={char.characterId} value={char.name}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Emotion *
            </label>
            <select
              value={editedSegment.emotion}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, emotion: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="neutral">Neutral</option>
              <option value="happy">Happy</option>
              <option value="excited">Excited</option>
              <option value="serious">Serious</option>
              <option value="concerned">Concerned</option>
              <option value="confident">Confident</option>
              <option value="friendly">Friendly</option>
              <option value="enthusiastic">Enthusiastic</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dialogue *
          </label>
          <textarea
            value={editedSegment.dialogue}
            onChange={(e) => setEditedSegment(prev => ({ ...prev, dialogue: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none transition-colors"
            placeholder="Character's spoken words..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Action *
          </label>
          <textarea
            value={editedSegment.action}
            onChange={(e) => setEditedSegment(prev => ({ ...prev, action: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none transition-colors"
            placeholder="What the character is doing while speaking..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Visual Cue (Optional)
          </label>
          <textarea
            value={editedSegment.visualCue || ''}
            onChange={(e) => setEditedSegment(prev => ({ ...prev, visualCue: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none transition-colors"
            placeholder="Visual elements, graphics, or scene descriptions..."
          />
        </div>
      </div>
    </div>
  );
};

export default DialogueSegmentCard; 