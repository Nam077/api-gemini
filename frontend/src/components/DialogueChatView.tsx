import React, { useState } from 'react';
import type { DialogueSegment, CharacterData } from '../services/api';
import { EditIcon, CloseIcon, CheckIcon, ClockIcon, MessageCircleIcon } from './Icons';

interface DialogueChatViewProps {
  dialogue: DialogueSegment[];
  characters: CharacterData[];
  onEditSegment: (index: number, segment: DialogueSegment) => void;
}

const DialogueChatView: React.FC<DialogueChatViewProps> = ({
  dialogue,
  characters,
  onEditSegment,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const getCharacterColor = (characterName: string) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500', 
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500'
    ];
    const index = characters.findIndex(char => char.name === characterName);
    return colors[index % colors.length];
  };


  const handleSaveEdit = (updatedSegment: DialogueSegment) => {
    if (editingIndex !== null) {
      onEditSegment(editingIndex, updatedSegment);
      setEditingIndex(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <MessageCircleIcon className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Video Script Dialogue</h3>
            <p className="text-sm text-gray-500">{dialogue.length} segments • {characters.length} characters</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {dialogue.map((segment, index) => {
          const isEven = index % 2 === 0;
          
          if (editingIndex === index) {
            return (
              <ChatEditForm
                key={index}
                segment={segment}
                index={index}
                characters={characters}
                onSave={handleSaveEdit}
                onCancel={() => setEditingIndex(null)}
              />
            );
          }

          return (
            <div key={index} className="w-full">
              <div className={`flex items-start gap-4 ${isEven ? 'justify-start' : 'justify-end'}`}>
                {/* Left side - Avatar for even messages */}
                {isEven && (
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getCharacterColor(segment.characterName)} rounded-full flex items-center justify-center shadow-lg ring-2 ring-white`}>
                      <span className="text-white font-bold text-sm">
                        {segment.characterName.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center truncate w-12">
                      {segment.characterName}
                    </p>
                  </div>
                )}

                {/* Message Container */}
                <div className={`flex flex-col max-w-lg ${isEven ? 'items-start' : 'items-end'}`}>
                  {/* Timestamp and Emotion */}
                  <div className={`flex items-center gap-2 mb-2 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    <ClockIcon size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{segment.timestamp}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      segment.emotion === 'happy' ? 'bg-yellow-100 text-yellow-700' :
                      segment.emotion === 'excited' ? 'bg-orange-100 text-orange-700' :
                      segment.emotion === 'serious' ? 'bg-gray-100 text-gray-700' :
                      segment.emotion === 'confident' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {segment.emotion}
                    </span>
                  </div>

                  {/* Chat Bubble */}
                  <div className="relative">
                    <div 
                      className={`relative p-4 rounded-2xl shadow-lg max-w-full ${
                        isEven 
                          ? 'bg-white border border-gray-200' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      }`}
                      style={{
                        borderBottomLeftRadius: isEven ? '4px' : '16px',
                        borderBottomRightRadius: isEven ? '16px' : '4px',
                      }}
                    >
                      {/* Speech bubble tail */}
                      <div
                        className={`absolute top-3 w-0 h-0 ${
                          isEven 
                            ? 'left-[-8px] border-t-[8px] border-r-[8px] border-b-[8px] border-l-0 border-t-transparent border-r-white border-b-transparent' 
                            : 'right-[-8px] border-t-[8px] border-l-[8px] border-b-[8px] border-r-0 border-t-transparent border-l-blue-500 border-b-transparent'
                        }`}
                      />

                      {/* Dialogue Text */}
                      <p className={`text-base leading-relaxed mb-3 ${isEven ? 'text-gray-900' : 'text-white'}`}>
                        "{segment.dialogue}"
                      </p>

                      {/* Action & Visual Cue */}
                      <div className="space-y-2 text-sm">
                        <div className={`${isEven ? 'text-gray-600' : 'text-blue-100'}`}>
                          <span className="font-medium">Action:</span> {segment.action}
                        </div>
                        {segment.visualCue && (
                          <div className={`${isEven ? 'text-gray-600' : 'text-blue-100'}`}>
                            <span className="font-medium">Visual:</span> {segment.visualCue}
                          </div>
                        )}
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingIndex(index)}
                        className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${
                          isEven 
                            ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                            : 'text-white/70 hover:text-white hover:bg-white/20'
                        }`}
                        title="Edit dialogue"
                      >
                        <EditIcon size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side - Avatar for odd messages */}
                {!isEven && (
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getCharacterColor(segment.characterName)} rounded-full flex items-center justify-center shadow-lg ring-2 ring-white`}>
                      <span className="text-white font-bold text-sm">
                        {segment.characterName.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center truncate w-12">
                      {segment.characterName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll to bottom indicator */}
      {dialogue.length > 3 && (
        <div className="text-center py-2 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">💬 Chat conversation • Scroll up to see more</p>
        </div>
      )}
    </div>
  );
};

// Edit Form Component
interface ChatEditFormProps {
  segment: DialogueSegment;
  index: number;
  characters: CharacterData[];
  onSave: (segment: DialogueSegment) => void;
  onCancel: () => void;
}

const ChatEditForm: React.FC<ChatEditFormProps> = ({
  segment,
  index,
  characters,
  onSave,
  onCancel,
}) => {
  const [editedSegment, setEditedSegment] = useState(segment);

  const handleSave = () => {
    onSave(editedSegment);
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 mx-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-blue-900">
          Editing Segment {index + 1}
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <CheckIcon size={14} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <CloseIcon size={14} />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Timestamp
            </label>
            <input
              value={editedSegment.timestamp}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, timestamp: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0:00-0:10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Character
            </label>
            <select
              value={editedSegment.characterName}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, characterName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Emotion
            </label>
            <select
              value={editedSegment.emotion}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, emotion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="neutral">Neutral</option>
              <option value="happy">Happy</option>
              <option value="excited">Excited</option>
              <option value="serious">Serious</option>
              <option value="confident">Confident</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dialogue
          </label>
          <textarea
            value={editedSegment.dialogue}
            onChange={(e) => setEditedSegment(prev => ({ ...prev, dialogue: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
            placeholder="Character's spoken words..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Action
            </label>
            <textarea
              value={editedSegment.action}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, action: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
              placeholder="Character actions..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Visual Cue
            </label>
            <textarea
              value={editedSegment.visualCue || ''}
              onChange={(e) => setEditedSegment(prev => ({ ...prev, visualCue: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
              placeholder="Visual elements..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueChatView; 