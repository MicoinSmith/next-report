"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

/**
 * 自定义 useTheme hook，自动处理 SSR 问题
 * @returns {{ theme: string, setTheme: function, mounted: boolean }}
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // 防止 SSR 时 theme 为 undefined
  useEffect(() => {
    setMounted(true);

    // 如果检测到 "auto" 值（旧版本遗留），将其转换为 "system"
    if (theme === "auto") {
      setTheme("system");
    }
  }, [theme, setTheme]);

  // 规范化主题值：将 "auto" 视为 "system"
  const normalizedTheme = theme === "auto" ? "system" : theme;

  // SSR 时返回默认值，确保服务器和客户端渲染一致
  const safeTheme = mounted ? normalizedTheme : "light";

  return {
    theme: safeTheme,
    setTheme,
    mounted,
    resolvedTheme: mounted ? resolvedTheme : "light", // 实际应用的主题（当 theme 是 "system" 时）
  };
}
