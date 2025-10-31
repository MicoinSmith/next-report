"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 用于在 React 组件中使用 localStorage
 *
 * @param {string} key - localStorage 键名
 * @param {any} initialValue - 初始值
 * @returns {[any, Function, Function]} - [值, setValue 函数, removeValue 函数]
 */
export function useLocalStorage(key, initialValue) {
  // 只在客户端初始化状态
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`读取 localStorage [${key}] 失败:`, error);
      return initialValue;
    }
  });

  // 监听 localStorage 变化（跨标签页同步）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`解析 localStorage [${key}] 失败:`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  // 设置值
  const setValue = useCallback(
    (value) => {
      try {
        // 支持函数式更新
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // 触发自定义事件，用于同标签页内同步
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: JSON.stringify(valueToStore),
            })
          );
        }
      } catch (error) {
        console.error(`设置 localStorage [${key}] 失败:`, error);
      }
    },
    [key, storedValue]
  );

  // 删除值
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
          })
        );
      }
    } catch (error) {
      console.error(`删除 localStorage [${key}] 失败:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * 基础 localStorage 工具函数（非 Hook）
 */
export const localStorage = {
  get: (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`读取 localStorage [${key}] 失败:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`设置 localStorage [${key}] 失败:`, error);
      return false;
    }
  },

  remove: (key) => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除 localStorage [${key}] 失败:`, error);
      return false;
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('清空 localStorage 失败:', error);
      return false;
    }
  },
};

export default useLocalStorage;
