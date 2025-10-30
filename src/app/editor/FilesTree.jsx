import { useMemo, useState } from "react";
import UploadInput from "./UploadInput";

// 结点结构: { id: string, name: string, type: 'file'|'folder', children?: Node[] }
export default function FilesTree({ tree = [], onSelect }) {
  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSelect = (node) => {
    if (onSelect) onSelect(node);
  };

  return (
    <div className="text-sm select-none">
      <div className="flex items-center justify-between border-b pb-2 border-neutral-200 dark:border-neutral-800">
        <p>文件总数 {tree.length}</p>
        <UploadInput />
      </div>
      {tree.length === 0 ? (
        <div className="text-neutral-500 text-center py-4">暂无文件</div>
      ) : (
        <ul className="space-y-1">
          {tree.map((n) => (
            <TreeNode key={n.id} node={n} expanded={expanded} onToggle={toggle} onSelect={handleSelect} level={0} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TreeNode({ node, expanded, onToggle, onSelect, level }) {
  const isFolder = node.type === "folder";
  const isOpen = expanded.has(node.id);
  const leftPad = 8 + level * 12;
  return (
    <li>
      <div
        className="flex items-center gap-2 rounded px-1 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
        style={{ paddingLeft: leftPad }}
        onClick={(e) => {
          e.stopPropagation();
          if (isFolder) onToggle(node.id); else onSelect(node);
        }}
        onDoubleClick={() => onSelect(node)}
      >
        <Chevron open={isOpen} hidden={!isFolder} />
        <TypeIcon type={node.type} open={isOpen} />
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && node.children.length > 0 && (
        <ul className="mt-1 space-y-1">
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} expanded={expanded} onToggle={onToggle} onSelect={onSelect} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Chevron({ open, hidden }) {
  if (hidden) return <span className="w-3" />;
  return (
    <svg className={`w-3 h-3 transition-transform ${open ? "rotate-90" : "rotate-0"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function TypeIcon({ type, open }) {
  if (type === "folder") {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4l2 2h8a2 2 0 012 2v1H2V6a2 2 0 012-2h6z" opacity=".6" />
        <path d="M2 9h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" opacity=".85" />
    </svg>
  );
}
