import React, { useEffect } from 'react';
import type { AIProvider } from '@/types';
import { AIProvider as AIProviderEnum } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { CLAUDE_MODELS, OLLAMA_DEFAULT_MODELS, OPENAI_MODELS } from '@/config';
import {
  setProvider,
  setApiKey,
  setModel,
  setOllamaEndpoint,
  setOllamaModels,
  setIsSettingsModalOpen,
} from '@/store/slices';
import { useFetchOllamaModelsQuery } from '@/store/api';
import { ResumeSettingsModal } from './ResumeSettingsModal';

export const AIProviderSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { provider, apiKeys, models, ollamaEndpoint, ollamaModels, isSettingsModalOpen } = useAppSelector(
    state => state.aiConfig
  );

  const { data: ollamaModelsData, isSuccess: isOllamaModelsSuccess } = useFetchOllamaModelsQuery(ollamaEndpoint, {
    skip: provider !== AIProviderEnum.OLLAMA,
  });

  useEffect(() => {
    if (isOllamaModelsSuccess && ollamaModelsData?.models) {
      const modelNames = ollamaModelsData.models.map(m => m.name);
      dispatch(setOllamaModels(modelNames));
    }
  }, [isOllamaModelsSuccess, ollamaModelsData, dispatch]);

  useEffect(() => {
    const currentModel = getCurrentModel();
    if (!currentModel) {
      const availableModels = getAvailableModels();
      if (availableModels.length > 0) {
        setCurrentModel(availableModels[0]);
      }
    }
  }, [provider, ollamaModels]);

  const getAvailableModels = (): string[] => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        return OPENAI_MODELS;
      case AIProviderEnum.CLAUDE:
        return CLAUDE_MODELS;
      case AIProviderEnum.OLLAMA:
        return ollamaModels.length > 0 ? ollamaModels : OLLAMA_DEFAULT_MODELS;
      default:
        return [];
    }
  };

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
      <ResumeSettingsModal isOpen={isSettingsModalOpen} onClose={() => dispatch(setIsSettingsModalOpen(false))} />

      <div className="group rounded-2xl border border-violet-100/50 bg-gradient-to-br from-white to-violet-50/30 p-5 shadow-lg transition-all duration-300 hover:border-violet-200 hover:shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-lg">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent">
              AI Provider Settings
            </h2>
          </div>
          <div className="h-full">
            <button
              onClick={() => dispatch(setIsSettingsModalOpen(true))}
              className="group/btn rounded-xl p-2.5 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-violet-50 hover:text-violet-600"
              title="Resume Settings"
            >
              <svg
                className="h-6 w-6 transition-transform duration-300 group-hover/btn:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-3.5">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
            Select AI Provider
          </label>
          <select
            value={provider}
            onChange={e => dispatch(setProvider(e.target.value as AIProvider))}
            className="w-full cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgN0wxMCAxMkwxNSA3IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] bg-[length:20px_20px] bg-[position:right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-12 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
          >
            <option value={AIProviderEnum.OPENAI}>OpenAI</option>
            <option value={AIProviderEnum.CLAUDE}>Claude (Anthropic)</option>
            <option value={AIProviderEnum.OLLAMA}>Ollama (Local)</option>
          </select>
        </div>

        {requiresApiKey() && (
          <div className="mb-3.5">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
              API Key
              {getApiKeyDocLink() && (
                <a
                  href={getApiKeyDocLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-violet-600 hover:text-violet-800"
                >
                  (Get API Key)
                </a>
              )}
            </label>
            <input
              type="password"
              value={getCurrentApiKey()}
              onChange={e => setCurrentApiKey(e.target.value)}
              placeholder={getApiKeyPlaceholder()}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm transition-all duration-200 placeholder:text-gray-400 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
            />
          </div>
        )}

        {provider === AIProviderEnum.OLLAMA && (
          <>
            <div className="mb-3.5">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                Ollama Endpoint
              </label>
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={e => dispatch(setOllamaEndpoint(e.target.value))}
                placeholder="http://localhost:11434"
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm transition-all duration-200 placeholder:text-gray-400 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
              />
            </div>

            <div className="mb-3.5">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                Select Model
              </label>
              <select
                value={getCurrentModel()}
                onChange={e => setCurrentModel(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgN0wxMCAxMkwxNSA3IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] bg-[length:20px_20px] bg-[position:right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-12 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
              >
                {getAvailableModels().map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {(provider === AIProviderEnum.OPENAI || provider === AIProviderEnum.CLAUDE) && (
          <div className="mb-3.5">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
              Select Model
            </label>
            <select
              value={getCurrentModel()}
              onChange={e => setCurrentModel(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgN0wxMCAxMkwxNSA3IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] bg-[length:20px_20px] bg-[position:right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-12 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
            >
              {getAvailableModels().map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={requiresApiKey() && !getCurrentApiKey()}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/40 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Settings
        </button>
      </div>
    </>
  );
};
