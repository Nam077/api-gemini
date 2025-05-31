import { useState } from 'react';
import ScriptGenerator from './components/ScriptGenerator';
import ScriptViewer from './components/ScriptViewer';
import './App.css';

function App() {
  const [scriptData, setScriptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScriptGenerated = (data: any) => {
    setScriptData(data);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 AI Script Generator</h1>
        <p>Tạo kịch bản video chuyên nghiệp với AI</p>
      </header>

      <main className="app-main">
        <ScriptGenerator 
          onScriptGenerated={handleScriptGenerated}
          loading={loading}
          setLoading={setLoading}
        />
        
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tạo kịch bản... Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}

        {scriptData && !loading && (
          <ScriptViewer scriptData={scriptData} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 AI Script Generator - Powered by AI ToolCheap</p>
      </footer>
    </div>
  );
}

export default App;
