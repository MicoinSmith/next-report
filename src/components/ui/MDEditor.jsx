"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 动态导入 MDEditor（避免 SSR 问题）
const MDEditorPrimitive = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const MDEditor = ({ theme: themeProp, className = "", ...props }) => {
  const { theme: globalTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 hydration 不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted ? (themeProp || globalTheme || "light") : "light";

  // @uiw/react-md-editor 使用 data-color-mode 属性来设置主题
  const colorMode = theme === "dark" ? "dark" : "light";

  // 根据主题添加额外的 className，确保 dark 类也应用
  const themeClass = theme === "dark" ? "dark" : "";

  if (!mounted) {
    return (
      <div className={`${themeClass} ${className}`} style={{ minHeight: "100%" }}>
        <div style={{ height: "100%", width: "100%" }} />
      </div>
    );
  }

  return (
    <div className={themeClass} data-color-mode={colorMode} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MDEditorPrimitive
        className={className}
        data-color-mode={colorMode}
        style={{ height: '100%', flex: 1 }}
        {...props}
      />
    </div>
  );
};

export default MDEditor;
