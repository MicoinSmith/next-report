"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react";

export default function Slidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: "/", label: "首页", icon: Home },
    { href: "/editor", label: "编辑器", icon: FileText },
  ];

  return (
    <aside
      className={`border-r bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-black/40 ${
        collapsed ? "w-[72px]" : "w-64"
      } h-svh sticky top-0 flex flex-col transition-[width] duration-200`}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex items-center gap-2 text-nowrap">
          <div className="h-6 w-6 rounded bg-black dark:bg-white" />
          {!collapsed && <span className="text-sm font-semibold text-nowrap">Next Report</span>}
        </div>
        <button
          type="button"
          aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex h-8 w-8 items-center justify-center rounded border text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
       >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`group flex items-center gap-3 rounded px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900`}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="px-2 pb-2">
          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">设置</span>}
          </Link>
        </div>
        <div className="border-t px-3 py-3 text-xs text-neutral-500 dark:border-neutral-800">
          {!collapsed ? <span>v0.1.0</span> : <span className="block text-center">v0</span>}
        </div>
      </div>
    </aside>
  );
}
