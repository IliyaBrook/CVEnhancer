import React, { useState, useEffect, useRef } from 'react';
import  { type AIConfig, type AIProvider, AIProvider as AIProviderEnum } from '@/types';
import { saveConfig, loadConfig } from '@/utils/storage';

interface AIProviderSettingsProps {
  config: AIConfig | null;
  onConfigChange: (config: AIConfig) => void;
}

export const AIProviderSettings: React.FC<AIProviderSettingsProps> = ({ onConfigChange }) => {
  const [provider, setProvider] = useState<AIProvider>(AIProviderEnum.OPENAI);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadedConfig = loadConfig();
    if (loadedConfig) {
      setProvider(loadedConfig.provider);
      setApiKey(loadedConfig.apiKey || '');
      setModel(loadedConfig.model || '');
      setOllamaEndpoint(loadedConfig.ollamaEndpoint || 'http://localhost:11434');
    }
  }, []);

  useEffect(() => {
    if (provider === AIProviderEnum.OLLAMA) {
      fetchOllamaModels();
    }
  }, [provider]);

  const fetchOllamaModels = async () => {
    try {
      const response = await fetch(`${ollamaEndpoint}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map((m: any) => m.name) || [];
        setOllamaModels(models);
        setFilteredModels(models);
      }
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
    }
  };

  const handleModelInputChange = (value: string) => {
    setModel(value);
    
    if (value.trim() === '') {
      setFilteredModels(ollamaModels);
    } else {
      const filtered = ollamaModels.filter(m =>
        m.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredModels(filtered);
    }
    setShowSuggestions(true);
  };

  const handleModelSelect = (selectedModel: string) => {
    setModel(selectedModel);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setFilteredModels(ollamaModels);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSave = () => {
    const newConfig: AIConfig = {
      provider,
      apiKey: requiresApiKey() ? apiKey : undefined,
      model: model || undefined,
      ollamaEndpoint: provider === AIProviderEnum.OLLAMA ? ollamaEndpoint : undefined
    };
    saveConfig(newConfig);
    onConfigChange(newConfig);
  };

  const requiresApiKey = () => {
    return provider !== AIProviderEnum.OLLAMA;
  };

  const getDefaultModel = () => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
      case AIProviderEnum.CHATGPT:
        return 'gpt-4';
      case AIProviderEnum.CLAUDE:
        return 'claude-3-sonnet-20240229';
      case AIProviderEnum.OLLAMA:
        return ollamaModels[0] || 'llama2';
      default:
        return '';
    }
  };

  const getApiKeyPlaceholder = () => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
      case AIProviderEnum.CHATGPT:
        return 'sk-...';
      case AIProviderEnum.CLAUDE:
        return 'sk-ant-...';
      default:
        return '';
    }
  };

  const getApiKeyDocLink = () => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
      case AIProviderEnum.CHATGPT:
        return 'https://platform.openai.com/api-keys';
      case AIProviderEnum.CLAUDE:
        return 'https://console.anthropic.com/settings/keys';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Provider Settings</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select AI Provider
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as AIProvider)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={AIProviderEnum.OPENAI}>OpenAI</option>
          <option value={AIProviderEnum.CHATGPT}>ChatGPT</option>
          <option value={AIProviderEnum.CLAUDE}>Claude (Anthropic)</option>
          <option value={AIProviderEnum.OLLAMA}>Ollama (Local)</option>
        </select>
      </div>

      {requiresApiKey() && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key
            {getApiKeyDocLink() && (
              <a
                href={getApiKeyDocLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
              >
                (Get API Key)
              </a>
            )}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={getApiKeyPlaceholder()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {provider === AIProviderEnum.OLLAMA && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ollama Endpoint
            </label>
            <input
              type="text"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <input
              ref={inputRef}
              type="text"
              value={model}
              onChange={(e) => handleModelInputChange(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type or select a model..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showSuggestions && filteredModels.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredModels.map((m) => (
                  <div
                    key={m}
                    onClick={() => handleModelSelect(m)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
            {showSuggestions && filteredModels.length === 0 && model.trim() !== '' && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No matching models. Press Enter to use "{model}"
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {(provider === AIProviderEnum.OPENAI || provider === AIProviderEnum.CHATGPT || provider === AIProviderEnum.CLAUDE) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model (Optional)
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={getDefaultModel()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={requiresApiKey() && !apiKey}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Save Settings
      </button>
    </div>
  );
};