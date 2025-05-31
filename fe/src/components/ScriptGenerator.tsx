import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../config/api';
import './ScriptGenerator.css';

interface ScriptData {
  scriptId: string;
  topic: string;
  characters: any[];
  scenes: any[];
  duration: string;
  context: string;
}

interface ScriptGeneratorProps {
  onScriptGenerated: (data: ScriptData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface FormData {
  topic: string;
  characterCount: number;
  sceneCount: number;
  dialoguePerScene: number;
  durationValue: number;
  durationUnit: string;
  context: string;
  scriptId: string;
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
  onScriptGenerated,
  loading,
  setLoading
}) => {
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    characterCount: 0,
    sceneCount: 0,
    dialoguePerScene: 0,
    durationValue: 0,
    durationUnit: '',
    context: '',
    scriptId: ''
  });

  const [error, setError] = useState<string>('');

  // Generate UUID for scriptId when component mounts
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      scriptId: uuidv4()
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'characterCount' || name === 'sceneCount' || name === 'dialoguePerScene' || name === 'durationValue'
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine duration value and unit into a single string
      const duration = `${formData.durationValue} ${formData.durationUnit}`;
      const submitData = {
        ...formData,
        duration
      };

      const response = await apiClient.post('/v1/scripts/auto', submitData);

      onScriptGenerated(response.data);
      
      // Tự động generate key mới sau khi API thành công
      setFormData(prev => ({
        ...prev,
        scriptId: uuidv4()
      }));
      
    } catch (err: unknown) {
      const error = err as any;
      const errorMessage = error.response?.data?.error || error.message || 'Có lỗi xảy ra khi tạo kịch bản';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewScriptId = () => {
    setFormData(prev => ({
      ...prev,
      scriptId: uuidv4()
    }));
  };

  return (
    <div className="script-generator">
      <h2>Tạo Kịch Bản Video</h2>
      
      <form onSubmit={handleSubmit} className="generator-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="topic">Chủ đề kịch bản:</label>
          <textarea
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="Nhập chủ đề cho kịch bản video của bạn..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="characterCount">Số nhân vật:</label>
            <input
              type="number"
              id="characterCount"
              name="characterCount"
              value={formData.characterCount}
              onChange={handleInputChange}
              min="1"
              max="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sceneCount">Số cảnh:</label>
            <input
              type="number"
              id="sceneCount"
              name="sceneCount"
              value={formData.sceneCount}
              onChange={handleInputChange}
              min="1"
              max="20"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dialoguePerScene">Số câu thoại mỗi cảnh:</label>
            <input
              type="number"
              id="dialoguePerScene"
              name="dialoguePerScene"
              value={formData.dialoguePerScene}
              onChange={handleInputChange}
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="duration-group">
            <div className="form-group">
              <label htmlFor="durationValue">Thời lượng:</label>
              <input
                type="number"
                id="durationValue"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleInputChange}
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="durationUnit">Đơn vị:</label>
              <select
                id="durationUnit"
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn đơn vị</option>
                <option value="giây">Giây</option>
                <option value="phút">Phút</option>
                <option value="giờ">Giờ</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="scriptId">ID kịch bản:</label>
            <div className="script-id-container">
              <input
                type="text"
                id="scriptId"
                name="scriptId"
                value={formData.scriptId}
                onChange={handleInputChange}
                placeholder="ID duy nhất cho kịch bản..."
                required
                readOnly
              />
              <button 
                type="button" 
                className="regenerate-btn"
                onClick={generateNewScriptId}
                title="Tạo ID mới"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="context">Bối cảnh:</label>
          <textarea
            id="context"
            name="context"
            value={formData.context}
            onChange={handleInputChange}
            placeholder="Mô tả bối cảnh, không gian diễn ra kịch bản..."
            required
          />
        </div>

        <button 
          type="submit" 
          className="generate-btn" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Đang tạo kịch bản...
            </>
          ) : (
            'Tạo Kịch Bản'
          )}
        </button>
      </form>
    </div>
  );
};

export default ScriptGenerator;