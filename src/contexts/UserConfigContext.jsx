"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage, localStorage as ls } from '@/hooks/useLocalStorage';

const UserConfigContext = createContext(null);

// localStorage 键名
const STORAGE_KEY = 'user_config';

// 默认 LLM 配置
const defaultConfig = {
  llm_provider: 'openai',
  api_key: '',
  model: 'gpt-4-turbo',
  api_endpoint: 'https://api.openai.com/v1',
};

export function UserConfigProvider({ children, initialConfig = {} }) {
  // 从 localStorage 读取配置
  const [storedConfig, setStoredConfig, removeConfig] = useLocalStorage(
    STORAGE_KEY,
    { ...defaultConfig, ...initialConfig }
  );

  // 合并默认配置和存储的配置
  const [config, setConfigState] = useState(() => {
    return { ...defaultConfig, ...storedConfig, ...initialConfig };
  });

  // 监听 localStorage 变化，同步到 state
  useEffect(() => {
    if (storedConfig) {
      setConfigState(prev => ({ ...defaultConfig, ...storedConfig }));
    }
  }, [storedConfig]);

  // 更新整个配置
  const updateConfig = useCallback(
    (newConfig) => {
      const mergedConfig = { ...config, ...newConfig };
      setConfigState(mergedConfig);
      setStoredConfig(mergedConfig);
    },
    [config, setStoredConfig]
  );

  // 更新单个字段
  const updateField = useCallback(
    (field, value) => {
      const newConfig = { ...config, [field]: value };
      setConfigState(newConfig);
      setStoredConfig(newConfig);
    },
    [config, setStoredConfig]
  );

  // 重置为默认配置
  const resetConfig = useCallback(() => {
    const defaultCfg = { ...defaultConfig, ...initialConfig };
    setConfigState(defaultCfg);
    setStoredConfig(defaultCfg);
  }, [initialConfig, setStoredConfig]);

  // 清空配置
  const clearConfig = useCallback(() => {
    removeConfig();
    setConfigState({ ...defaultConfig, ...initialConfig });
  }, [initialConfig, removeConfig]);

  // 获取单个字段
  const getField = useCallback(
    (field) => {
      return config[field];
    },
    [config]
  );

  // 导出配置
  const exportConfig = useCallback(() => {
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llm-config.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [config]);

  // 导入配置
  const importConfig = useCallback((jsonConfig) => {
    try {
      const importedConfig = typeof jsonConfig === 'string'
        ? JSON.parse(jsonConfig)
        : jsonConfig;

      // 验证配置格式
      const validConfig = {
        llm_provider: importedConfig.llm_provider || defaultConfig.llm_provider,
        api_key: importedConfig.api_key || defaultConfig.api_key,
        model: importedConfig.model || defaultConfig.model,
        api_endpoint: importedConfig.api_endpoint || defaultConfig.api_endpoint,
      };

      setConfigState(validConfig);
      setStoredConfig(validConfig);
      return true;
    } catch (error) {
      console.error('导入配置失败:', error);
      return false;
    }
  }, [setStoredConfig]);

  // 检查配置是否完整
  const isConfigValid = useCallback(() => {
    return !!(config.api_key && config.llm_provider && config.model);
  }, [config]);

  const value = {
    config,
    updateConfig,
    updateField,
    resetConfig,
    clearConfig,
    getField,
    exportConfig,
    importConfig,
    isConfigValid,
  };

  return (
    <UserConfigContext.Provider value={value}>
      {children}
    </UserConfigContext.Provider>
  );
}

export function useUserConfig() {
  const context = useContext(UserConfigContext);
  if (!context) {
    throw new Error('useUserConfig must be used within a UserConfigProvider');
  }
  return context;
}

// 便捷方法：在不使用 Hook 的地方访问配置
export const userConfig = {
  get: (field = null) => {
    const config = ls.get(STORAGE_KEY, defaultConfig);
    return field ? config[field] : config;
  },

  set: (field, value) => {
    const config = ls.get(STORAGE_KEY, defaultConfig);
    const newConfig = { ...config, [field]: value };
    return ls.set(STORAGE_KEY, newConfig);
  },

  getAll: () => {
    return ls.get(STORAGE_KEY, defaultConfig);
  },

  update: (newConfig) => {
    const config = ls.get(STORAGE_KEY, defaultConfig);
    const mergedConfig = { ...config, ...newConfig };
    return ls.set(STORAGE_KEY, mergedConfig);
  },

  reset: () => {
    return ls.set(STORAGE_KEY, defaultConfig);
  },

  clear: () => {
    return ls.remove(STORAGE_KEY);
  },
};
