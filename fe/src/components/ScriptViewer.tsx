import React, { useState } from 'react';
import './ScriptViewer.css';

interface ScriptViewerProps {
  scriptData: any;
}

const ScriptViewer: React.FC<ScriptViewerProps> = ({ scriptData }) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'json' | 'text'>('formatted');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã copy vào clipboard!');
  };

  const downloadScript = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCharacter = (character: any, index: number) => (
    <div key={index} className="character-card">
      <h4>👤 {character.name} ({character.age} tuổi)</h4>
      <p><strong>Vai trò:</strong> {character.role}</p>
      <p><strong>Tính cách:</strong> {character.personality?.join(', ')}</p>
      <p><strong>Ngoại hình:</strong> {character.appearance}</p>
      <p><strong>Cách nói:</strong> {character.speakingStyle}</p>
      <p><strong>Trang phục:</strong> {character.costume}</p>
      <p><strong>Hướng dẫn diễn:</strong> {character.actingNotes}</p>
    </div>
  );

  const renderScene = (scene: any, index: number) => (
    <div key={index} className="scene-card">
      <h4>🎬 Scene {scene.sceneNumber}: {scene.title}</h4>
      <div className="scene-info">
        <p><strong>Địa điểm:</strong> {scene.setting}</p>
        <p><strong>Thời lượng:</strong> {scene.estimatedDuration}</p>
        <p><strong>Nhân vật:</strong> {scene.characters?.join(', ')}</p>
      </div>
      
      <div className="dialogue-section">
        <h5>💬 Hội thoại:</h5>
        {scene.dialogue?.map((line: any, dialogueIndex: number) => (
          <div key={dialogueIndex} className="dialogue-line">
            <div className="character-avatar">
              {line.character.charAt(0).toUpperCase()}
            </div>
            <div className="dialogue-bubble">
              <span className="character-name">{line.character}</span>
              <span className="dialogue-text">"{line.text}"</span>
              <div className="dialogue-meta">
                <span className="emotion">😊 {line.emotion}</span>
                <span className="action">🎭 {line.action}</span>
                <span className="timing">⏱️ {line.timing}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="production-notes">
        <p><strong>Camera:</strong> {scene.cameraSetup}</p>
        <p><strong>Ánh sáng:</strong> {scene.lighting}</p>
        <p><strong>Đạo cụ:</strong> {scene.props?.join(', ')}</p>
        <p><strong>Âm thanh:</strong> {scene.soundEffects}</p>
        <p><strong>Nhạc nền:</strong> {scene.backgroundMusic}</p>
      </div>
    </div>
  );

  return (
    <div className="script-viewer">
      <div className="viewer-header">
        <h2>📄 Kịch Bản Đã Tạo</h2>
        <div className="script-meta">
          <span>🆔 {scriptData.scriptId}</span>
          <span>📅 {formatDateTime(scriptData.generatedAt)}</span>
          <span>✅ {scriptData.message}</span>
        </div>
      </div>

      <div className="tab-buttons">
        <button 
          className={activeTab === 'formatted' ? 'active' : ''}
          onClick={() => setActiveTab('formatted')}
        >
          📋 Formatted View
        </button>
        <button 
          className={activeTab === 'text' ? 'active' : ''}
          onClick={() => setActiveTab('text')}
        >
          📝 Text View
        </button>
        <button 
          className={activeTab === 'json' ? 'active' : ''}
          onClick={() => setActiveTab('json')}
        >
          🔧 JSON Data
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'formatted' && (
          <div className="formatted-view">
            <div className="video-info">
              <h3>🎥 Thông Tin Video</h3>
              <div className="info-grid">
                <p><strong>Tiêu đề:</strong> {scriptData.script.videoInfo?.title}</p>
                <p><strong>Thể loại:</strong> {scriptData.script.videoInfo?.genre}</p>
                <p><strong>Thời lượng:</strong> {scriptData.script.videoInfo?.totalDuration}</p>
                <p><strong>Tone:</strong> {scriptData.script.videoInfo?.tone}</p>
                <p><strong>Mục tiêu:</strong> {scriptData.script.videoInfo?.objective}</p>
                <p><strong>Bối cảnh:</strong> {scriptData.script.videoInfo?.context}</p>
              </div>
            </div>

            <div className="topic-analysis">
              <h3>🎯 Phân Tích Chủ Đề</h3>
              <p><strong>Tóm tắt:</strong> {scriptData.script.topicAnalysis?.summary}</p>
              <div className="key-points">
                <strong>Điểm chính:</strong>
                <ul>
                  {scriptData.script.topicAnalysis?.keyPoints?.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Phù hợp bối cảnh:</strong> {scriptData.script.topicAnalysis?.contextFit}</p>
            </div>

            <div className="characters-section">
              <h3>👥 Nhân Vật</h3>
              <div className="characters-grid">
                {scriptData.script.characters?.map(renderCharacter)}
              </div>
            </div>

            <div className="scenes-section">
              <h3>🎬 Các Scene</h3>
              <div className="scenes-list">
                {scriptData.script.scenes?.map(renderScene)}
              </div>
            </div>

            <div className="production-info">
              <h3>🎪 Thông Tin Sản Xuất</h3>
              <div className="production-grid">
                <p><strong>Thiết bị:</strong> {scriptData.script.production?.equipment?.join(', ')}</p>
                <p><strong>Thời gian quay:</strong> {scriptData.script.production?.estimatedFilmingTime}</p>
                <p><strong>Ngân sách:</strong> {scriptData.script.production?.budget}</p>
                <p><strong>Yêu cầu địa điểm:</strong> {scriptData.script.production?.locationRequirements}</p>
                <div className="special-notes">
                  <strong>Ghi chú đặc biệt:</strong>
                  <ul>
                    {scriptData.script.production?.specialNotes?.map((note: string, index: number) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="text-view">
            <div className="action-buttons">
              <button onClick={() => copyToClipboard(scriptData.textResponse)}>
                📋 Copy Text
              </button>
              <button onClick={() => downloadScript(scriptData.textResponse, `${scriptData.scriptId}.txt`)}>
                💾 Download Text
              </button>
            </div>
            <pre className="text-content">{scriptData.textResponse}</pre>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="json-view">
            <div className="action-buttons">
              <button onClick={() => copyToClipboard(JSON.stringify(scriptData.script, null, 2))}>
                📋 Copy JSON
              </button>
              <button onClick={() => downloadScript(JSON.stringify(scriptData.script, null, 2), `${scriptData.scriptId}.json`)}>
                💾 Download JSON
              </button>
            </div>
            <pre className="json-content">
              {JSON.stringify(scriptData.script, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="parameters-info">
        <h3>⚙️ Parameters Đã Sử Dụng</h3>
        <div className="params-grid">
          <span>👥 {scriptData.parameters.characterCount} nhân vật</span>
          <span>🎬 {scriptData.parameters.sceneCount} scenes</span>
          <span>💬 {scriptData.parameters.dialoguePerScene} câu thoại/scene</span>
          <span>⏱️ {scriptData.parameters.duration}</span>
          <span>🏢 {scriptData.parameters.context}</span>
        </div>
      </div>
    </div>
  );
};

export default ScriptViewer;