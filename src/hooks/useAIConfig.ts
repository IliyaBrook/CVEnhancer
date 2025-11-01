import { useState, useEffect } from 'react';
import type { AIConfig } from '@/types';
import { loadConfig, saveConfig } from '@/utils';

export const useAIConfig = () => {
  const [config, setConfig] = useState<AIConfig | null>(null);

  useEffect(() => {
    const loadedConfig = loadConfig();
    if (loadedConfig) {
      setConfig(loadedConfig);
    }
  }, []);

  const updateConfig = (newConfig: AIConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  return {
    config,
    updateConfig
  };
};