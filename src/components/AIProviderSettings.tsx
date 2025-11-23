import React, { useEffect, useRef } from 'react';
import type { AIProvider } from '@/types';
import { AIProvider as AIProviderEnum } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setProvider,
  setApiKey,
  setModel,
  setOllamaEndpoint,
  setOllamaModels,
  setShowSuggestions,
  filterModels,
  setIsSettingsModalOpen,
} from '@/store/slices';
import { useFetchOllamaModelsQuery } from '@/store/api';
import { ResumeSettingsModal } from './ResumeSettingsModal';

export const AIProviderSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    provider,
    apiKeys,
    models,
    ollamaEndpoint,
    ollamaModels,
    showSuggestions,
    filteredModels,
    isSettingsModalOpen,
  } = useAppSelector(state => state.aiConfig);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: ollamaModelsData, isSuccess: isOllamaModelsSuccess } = useFetchOllamaModelsQuery(
    ollamaEndpoint,
    {
      skip: provider !== AIProviderEnum.OLLAMA,
    }
  );


  useEffect(() => {
    if (isOllamaModelsSuccess && ollamaModelsData?.models) {
      const modelNames = ollamaModelsData.models.map(m => m.name);
      dispatch(setOllamaModels(modelNames));
    }
  }, [isOllamaModelsSuccess, ollamaModelsData, dispatch]);

  const getCurrentModel = () => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        return models.openai || '';
      case AIProviderEnum.CLAUDE:
        return models.claude || '';
      case AIProviderEnum.OLLAMA:
        return models.ollama || '';
      default:
        return '';
    }
  };

  const setCurrentModel = (value: string) => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        dispatch(setModel({ provider: 'openai', model: value }));
        break;
      case AIProviderEnum.CLAUDE:
        dispatch(setModel({ provider: 'claude', model: value }));
        break;
      case AIProviderEnum.OLLAMA:
        dispatch(setModel({ provider: 'ollama', model: value }));
        break;
    }
  };

  const handleModelInputChange = (value: string) => {
    setCurrentModel(value);
    dispatch(filterModels(value));
    dispatch(setShowSuggestions(true));
  };

  const handleModelSelect = (selectedModel: string) => {
    setCurrentModel(selectedModel);
    dispatch(setShowSuggestions(false));
  };

  const handleInputFocus = () => {
    dispatch(setShowSuggestions(true));
  };

  const handleInputBlur = () => {
    setTimeout(() => dispatch(setShowSuggestions(false)), 200);
  };

  const handleSave = () => {
    dispatch(setIsSettingsModalOpen(false));
  };

  const requiresApiKey = () => {
    return provider !== AIProviderEnum.OLLAMA;
  };

  const getCurrentApiKey = () => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        return apiKeys.openai || '';
      case AIProviderEnum.CLAUDE:
        return apiKeys.claude || '';
      default:
        return '';
    }
  };

  const setCurrentApiKey = (value: string) => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        dispatch(setApiKey({ provider: 'openai', key: value }));
        break;
      case AIProviderEnum.CLAUDE:
        dispatch(setApiKey({ provider: 'claude', key: value }));
        break;
    }
  };

  const getDefaultModel = () => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
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
        return 'https://platform.openai.com/api-keys';
      case AIProviderEnum.CLAUDE:
        return 'https://console.anthropic.com/settings/keys';
      default:
        return '';
    }
  };

  return (
    <>
      <ResumeSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => dispatch(setIsSettingsModalOpen(false))}
      />
      
      <div className="group bg-gradient-to-br from-white to-violet-50/30 rounded-2xl shadow-lg hover:shadow-2xl border border-violet-100/50 p-5 mb-6 transition-all duration-300 hover:border-violet-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AI Provider Settings
            </h2>
          </div>
          <button
            onClick={() => dispatch(setIsSettingsModalOpen(true))}
            className="p-2.5 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200 hover:scale-110 group/btn"
            title="Resume Settings"
          >
            <svg className="w-6 h-6 transition-transform group-hover/btn:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      
      <div className="mb-3.5">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
          Select AI Provider
        </label>
        <select
          value={provider}
          onChange={(e) => dispatch(setProvider(e.target.value as AIProvider))}
          className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgN0wxMCAxMkwxNSA3IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] bg-[length:20px_20px] bg-[position:right_12px_center] bg-no-repeat pr-12 font-medium text-gray-900 text-sm"
        >
          <option value={AIProviderEnum.OPENAI}>OpenAI</option>
          <option value={AIProviderEnum.CLAUDE}>Claude (Anthropic)</option>
          <option value={AIProviderEnum.OLLAMA}>Ollama (Local)</option>
        </select>
      </div>

      {requiresApiKey() && (
        <div className="mb-3.5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
            API Key
            {getApiKeyDocLink() && (
              <a
                href={getApiKeyDocLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-violet-600 hover:text-violet-800 text-xs"
              >
                (Get API Key)
              </a>
            )}
          </label>
          <input
            type="password"
            value={getCurrentApiKey()}
            onChange={(e) => setCurrentApiKey(e.target.value)}
            placeholder={getApiKeyPlaceholder()}
            className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 placeholder:text-gray-400 font-mono text-sm"
          />
        </div>
      )}

      {provider === AIProviderEnum.OLLAMA && (
        <>
          <div className="mb-3.5">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              Ollama Endpoint
            </label>
            <input
              type="text"
              value={ollamaEndpoint}
              onChange={(e) => dispatch(setOllamaEndpoint(e.target.value))}
              placeholder="http://localhost:11434"
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 placeholder:text-gray-400 font-mono text-sm"
            />
          </div>

          <div className="mb-3.5 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              Select Model
            </label>
            <input
              ref={inputRef}
              type="text"
              value={getCurrentModel()}
              onChange={(e) => handleModelInputChange(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type or select a model..."
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 placeholder:text-gray-400 font-medium text-gray-900 text-sm"
            />
            {showSuggestions && filteredModels.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-violet-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-sm">
                {filteredModels.map((m: string) => (
                  <div
                    key={m}
                    onClick={() => handleModelSelect(m)}
                    className="px-4 py-3 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 cursor-pointer transition-all duration-150 border-b border-gray-100 last:border-b-0 flex items-center gap-2 group/item"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-0 group-hover/item:opacity-100 transition-opacity"></span>
                    <span className="font-medium text-gray-700 group-hover/item:text-violet-700">{m}</span>
                  </div>
                ))}
              </div>
            )}
            {showSuggestions && filteredModels.length === 0 && getCurrentModel().trim() !== '' && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No matching models. Press Enter to use "{getCurrentModel()}"
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {(provider === AIProviderEnum.OPENAI || provider === AIProviderEnum.CLAUDE) && (
        <div className="mb-3.5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
            Model (Optional)
          </label>
          <input
            type="text"
            value={getCurrentModel()}
            onChange={(e) => setCurrentModel(e.target.value)}
            placeholder={getDefaultModel()}
            className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 placeholder:text-gray-400 font-mono text-sm"
          />
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={requiresApiKey() && !getCurrentApiKey()}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-5 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] disabled:bg-gradient-to-r disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2 group text-sm"
      >
        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
        </svg>
        Save Settings
      </button>
      </div>
    </>
  );
};