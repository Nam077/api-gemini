import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  RefreshIcon,
  FireIcon,
  LoadingSpinner 
} from './Icons';

interface ApiKeyInfo {
  id: string;
  nickname?: string;
  isActive: boolean;
  lastUsed: string;
  errorCount: number;
  createdAt: string;
  expiresAt?: string;
}

interface ApiKeyStats {
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  errorKeys: number;
  workingKeys: number;
}

export const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [stats, setStats] = useState<ApiKeyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [addingKey, setAddingKey] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

  // Fetch API keys and stats
  const fetchKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/keys`);
      const result = await response.json();
      
      if (result.success) {
        setKeys(result.data.keys);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new API key
  const addApiKey = async () => {
    if (!newKey.trim()) return;
    
    setAddingKey(true);
    try {
      const response = await fetch(`${API_BASE}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newKey.trim(),
          nickname: newNickname.trim() || undefined
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewKey('');
        setNewNickname('');
        setShowAddForm(false);
        fetchKeys();
      } else {
        alert(`Failed to add API key: ${result.error}`);
      }
    } catch {
      alert('Failed to add API key');
    } finally {
      setAddingKey(false);
    }
  };

  // Remove API key
  const removeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to remove this API key?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/keys/${keyId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchKeys();
      } else {
        alert(`Failed to remove API key: ${result.error}`);
      }
    } catch {
      alert('Failed to remove API key');
    }
  };

  // Test all keys
  const testAllKeys = async () => {
    try {
      const response = await fetch(`${API_BASE}/keys/validate-all`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchKeys();
        alert(result.data.message);
      }
    } catch {
      alert('Failed to test API keys');
    }
  };

  // Cleanup expired keys
  const cleanupKeys = async () => {
    try {
      const response = await fetch(`${API_BASE}/keys/cleanup`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchKeys();
        alert(result.data.message);
      }
    } catch {
      alert('Failed to cleanup API keys');
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const getStatusColor = (key: ApiKeyInfo) => {
    if (!key.isActive || key.errorCount >= 3) return 'text-red-600 bg-red-50';
    if (key.errorCount > 0) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (key: ApiKeyInfo) => {
    if (!key.isActive || key.errorCount >= 3) return 'Expired/Invalid';
    if (key.errorCount > 0) return `${key.errorCount} Errors`;
    return 'Active';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
          <p className="text-gray-600 mt-2">Manage your Gemini API keys for video script generation</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={testAllKeys}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshIcon size={18} />
            Test All Keys
          </button>
          
          <button
            onClick={cleanupKeys}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <TrashIcon size={18} />
            Cleanup Expired
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon size={18} />
            Add API Key
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalKeys}</div>
            <div className="text-sm text-gray-600">Total Keys</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.workingKeys}</div>
            <div className="text-sm text-gray-600">Working Keys</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.errorKeys}</div>
            <div className="text-sm text-gray-600">Warning Keys</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expiredKeys}</div>
            <div className="text-sm text-gray-600">Expired Keys</div>
          </div>
          <div className="card text-center">
            <button onClick={fetchKeys} className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
              <RefreshIcon size={24} className="text-gray-400 mb-1" />
              <div className="text-sm text-gray-600">Refresh</div>
            </button>
          </div>
        </div>
      )}

      {/* Add Key Form */}
      {showAddForm && (
        <div className="card mb-8 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">Add New API Key</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <input
                type="password"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="AIza..."
                className="input-field"
                disabled={addingKey}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname (Optional)
              </label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="Production Key 1"
                className="input-field"
                disabled={addingKey}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={addApiKey}
                disabled={!newKey.trim() || addingKey}
                className="btn-primary flex items-center gap-2"
              >
                {addingKey ? <LoadingSpinner size={18} /> : <CheckIcon size={18} />}
                Add Key
              </button>
              
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewKey('');
                  setNewNickname('');
                }}
                className="btn-secondary"
                disabled={addingKey}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">API Keys ({keys.length})</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <LoadingSpinner size={32} className="mx-auto mb-4" />
            <p className="text-gray-600">Loading API keys...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <FireIcon size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">No API keys added yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First API Key
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900">
                      {key.nickname || `Key ${key.id.slice(-6)}`}
                    </h4>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(key)}`}>
                      {getStatusText(key)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    <span>Last used: {new Date(key.lastUsed).toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                    {key.expiresAt && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-red-600">Expired: {new Date(key.expiresAt).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeKey(key.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove key"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 