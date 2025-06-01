import React, { useState } from 'react';
import type { CharacterData } from '../services/api';
import EditableList from './EditableList';
import { EditIcon, CloseIcon, CheckIcon } from './Icons';

interface CharacterCardProps {
  character: CharacterData;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (character: CharacterData) => void;
  onCancel: () => void;
  onRemove: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  index, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onRemove 
}) => {
  const [editedCharacter, setEditedCharacter] = useState(character);

  const handleSave = () => {
    onSave(editedCharacter);
  };

  const handleCancel = () => {
    setEditedCharacter(character); // Reset to original
    onCancel();
  };

  const handlePersonalityChange = (personality: string[]) => {
    setEditedCharacter(prev => ({
      ...prev,
      personality
    }));
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{character.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{character.name}</h4>
                <p className="text-purple-600 font-medium">{character.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Character"
              >
                <EditIcon size={16} />
              </button>
              <button
                onClick={onRemove}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove Character"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Description</h5>
                <p className="text-gray-900 text-sm leading-relaxed">{character.description}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Voice Style</h5>
                <p className="text-gray-900 text-sm">{character.voiceStyle}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Appearance</h5>
                <p className="text-gray-900 text-sm leading-relaxed">{character.appearance}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Personality Traits</h5>
                <div className="flex flex-wrap gap-2">
                  {character.personality.map((trait, traitIndex) => (
                    <span
                      key={traitIndex}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {character.customPrompt && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Custom Prompt</h5>
              <p className="text-gray-600 text-sm italic bg-gray-50 rounded-lg p-3">
                "{character.customPrompt}"
              </p>
            </div>
          )}
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
              Editing Character {index + 1}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              value={editedCharacter.name}
              onChange={(e) => setEditedCharacter(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Character name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role *
            </label>
            <input
              value={editedCharacter.role}
              onChange={(e) => setEditedCharacter(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Character role or profession"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={editedCharacter.description}
            onChange={(e) => setEditedCharacter(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none transition-colors"
            placeholder="Describe the character's background, expertise, and purpose..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Appearance *
          </label>
          <textarea
            value={editedCharacter.appearance}
            onChange={(e) => setEditedCharacter(prev => ({ ...prev, appearance: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none transition-colors"
            placeholder="Describe physical appearance, clothing, age, style..."
          />
        </div>

        <div>
          <EditableList
            items={editedCharacter.personality}
            onChange={handlePersonalityChange}
            label="Personality Traits"
            placeholder="Add a personality trait..."
            addButtonText="Add Trait"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Voice Style *
          </label>
          <input
            value={editedCharacter.voiceStyle}
            onChange={(e) => setEditedCharacter(prev => ({ ...prev, voiceStyle: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Confident and clear, warm and friendly..."
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterCard; 