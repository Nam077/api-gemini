import React, { useState } from 'react';
import { CloseIcon, EditIcon, CheckIcon, PlusIcon } from './Icons';

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label: string;
  addButtonText?: string;
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  placeholder = "Add new item...",
  label,
  addButtonText = "Add"
}) => {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = editValue.trim();
      onChange(updatedItems);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        handleAddItem();
      } else {
        handleSaveEdit();
      }
    } else if (e.key === 'Escape' && action === 'edit') {
      handleCancelEdit();
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Add new item */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, 'add')}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItem.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
        >
          <PlusIcon size={14} />
          {addButtonText}
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
            {editingIndex === index ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'edit')}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Save"
                >
                  <CheckIcon size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Cancel"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-800">{item}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(index)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    <EditIcon size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-500 italic py-4 text-center">
          No items added yet. Click "{addButtonText}" to add your first item.
        </p>
      )}
    </div>
  );
};

export default EditableList;