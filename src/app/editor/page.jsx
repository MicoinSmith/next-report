"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkParse from "remark-parse";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import LeftPanel from "./LeftPanel";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { zhCommands, zhExtraCommands } from "./commands";
import { FileDown, MenuIcon } from "lucide-react";
import { commands } from "@uiw/react-md-editor";

const MDEditor = dynamic( () => import( "@uiw/react-md-editor" ), { ssr: false } );

// 导出工具函数（供头部按钮与弹层复用）
const exportMarkdownToMD = (markdown) => {
  const blob = new Blob( [markdown], { type: "text/markdown;charset=utf-8" } );
  const url = URL.createObjectURL( blob );
  const a = document.createElement( "a" );
  a.href = url;
  a.download = "report.md";
  a.click();
  URL.revokeObjectURL( url );
};

const exportMarkdownToHTML = (markdown) => {
  const tpl = `<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>Export HTML</title>
    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\" />
    <style>
      body { margin: 24px; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol; color: #111827; }
      .markdown-body { max-width: 100%; }
      .markdown-body pre { background: #f6f8fa; padding: 12px; border-radius: 6px; overflow: auto; }
    </style>
    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>
    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>
  </head>
  <body>
    <div id=\"app\" class=\"markdown-body\"></div>
    <script>
      (function(){
        try {
          window.marked.setOptions({
            highlight: function(code, lang) {
              try { return window.hljs.highlight(code, { language: lang || 'plaintext' }).value; } catch (e) { return code; }
            }
          });
          const md = decodeURIComponent(escape(atob('__B64__')));
          document.getElementById('app').innerHTML = window.marked.parse(md);
        } catch (e) {
          document.getElementById('app').textContent = 'Error rendering document.';
        }
      })();
    </script>
  </body>
</html>`;
  const b64 = btoa(unescape(encodeURIComponent(markdown)));
  const html = tpl.replace('__B64__', b64);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.html';
  a.click();
  URL.revokeObjectURL(url);
};

const exportMarkdownToPDF = (markdown) => {
  const tpl = `<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>Export PDF</title>
    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\" />
    <style>
      body { margin: 24px; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol; color: #111827; }
      .markdown-body { max-width: 100%; }
      .markdown-body pre { background: #f6f8fa; padding: 12px; border-radius: 6px; overflow: auto; }
      @media print { a { text-decoration: none; color: inherit; } }
    </style>
    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>
    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>
  </head>
  <body>
    <div id=\"app\" class=\"markdown-body\"></div>
    <script>
      try {
        window.marked.setOptions({
          highlight: function(code, lang) {
            try { return window.hljs.highlight(code, { language: lang || 'plaintext' }).value; } catch (e) { return code; }
          }
        });
        const md = decodeURIComponent(escape(atob('__B64__')));
        document.getElementById('app').innerHTML = window.marked.parse(md);
        setTimeout(() => window.print(), 100);
      } catch (e) {
        document.getElementById('app').textContent = 'Error rendering document.';
        setTimeout(() => window.print(), 100);
      }
    </script>
  </body>
</html>`;
  const b64 = btoa(unescape(encodeURIComponent(markdown)));
  const html = tpl.replace('__B64__', b64);
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}

export const ExportActions = ( { markdown } ) => {
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900" onClick={ () => exportMarkdownToMD(markdown) }>
        导出 MD
      </button>
      <button className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900" onClick={ () => exportMarkdownToHTML(markdown) }>
        导出 HTML
      </button>
      <button className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900" onClick={ () => exportMarkdownToPDF(markdown) }>
        导出 PDF
      </button>
    </div>
  );
}

const extractHeadings = ( md ) => {
  try {
    const tree = unified().use( remarkParse ).parse( md );
    const list = [];
    visit( tree, ( node ) => {
      if ( node.type === "heading" && node.depth >= 2 && node.depth <= 6 ) {
        const text = node.children?.map( ( c ) => c.value || c.alt || "" ).join( "" ) || "";
        const id = slugify( text );
        list.push( { depth: node.depth, text, id } );
      }
    } );
    return list;
  } catch {
    return [];
  }
}

const visit = ( node, cb ) => {
  cb( node );
  if ( node.children ) node.children.forEach( ( c ) => visit( c, cb ) );
}

const slugify = ( s ) => {
  return s
    .toLowerCase()
    .replace( /[^a-z0-9\u4e00-\u9fa5\s-]/g, "" )
    .trim()
    .replace( /\s+/g, "-" );
}


export default function Editor() {
  const [value, setValue] = useState( "" );
  const [showToc, setShowToc] = useState( false );
  const [showExportMenu, setShowExportMenu] = useState( false );
  const initializedRef = useRef(false);
  const STORAGE_KEY = "editor-content";
  useEffect( () => {
    const cached = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (cached && !initializedRef.current) {
      setValue(cached);
      initializedRef.current = true;
      return;
    }
    let cancelled = false;
    ( async () => {
      try {
        const res = await fetch( "/default.md?ts=" + Date.now(), { cache: "no-store" } );
        const text = res.ok ? await res.text() : "";
        if ( !cancelled && !initializedRef.current ) {
          setValue( text || "" );
          initializedRef.current = true;
        }
      } catch {}
    } )();
    return () => {
      cancelled = true;
    };
  }, [] );
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, value || "");
      }
    } catch {}
  }, [value]);

  const toc = useMemo( () => extractHeadings( value ), [value] );
  const tocCommand = useMemo( () => [{
    name: "toc",
    keyCommand: "toc",
    buttonProps: { title: "目录 (TOC)", "aria-label": "目录" },
    icon: <span style={ { fontSize: 12, fontWeight: 500, verticalAlign: "top", display: "inline-block", transform: "translateY(-1px)", color: showToc ? "inherit" : "var(--color-white)" } }>TOC</span>,
    execute: () => setShowToc( ( v ) => !v ),
  }], [] );

  return (
    <div className="flex min-h-svh w-full h-full">
      {/* 左侧：Topic / 数据源 / 生成大纲 */ }
      <LeftPanel />

      {/* 内容区 */ }
      <div className="h-full flex flex-1 flex-col">
        <div className="header h-12 flex items-center justify-between px-4 py-2 border-b dark:border-neutral-800">
          <h2 className="text-sm font-semibold">AI Markdown Editor</h2>
          <div className="relative">
            <button className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 flex items-center gap-1 cursor-pointer"
              onClick={() => setShowExportMenu(v => !v)}>
              <FileDown className="w-3 h-3" />
              <span className="ml-1">导出</span>

            </button>
            {showExportMenu && (
              <div className="absolute right-[-16px] mt-2 z-50 w-26 rounded-md border bg-background p-2 shadow-lg dark:border-neutral-800 z-60">
                <button className="w-full text-left rounded px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  onClick={() => { exportMarkdownToMD(value); setShowExportMenu(false); }}>
                  导出 MD
                </button>
                <button className="w-full text-left rounded px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  onClick={() => { exportMarkdownToHTML(value); setShowExportMenu(false); }}>
                  导出 HTML
                </button>
                <button className="w-full text-left rounded px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  onClick={() => { exportMarkdownToPDF(value); setShowExportMenu(false); }}>
                  导出 PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-full max-h-[calc(100vh-48px-40px)] flex overflow-hidden">
          <section className="h-full flex-1 border-r dark:border-neutral-800 overflow-hidden">
            <MDEditor
              value={ value }
              className="h-full w-full"
              preview="live"
              height="100%"
              visibleDragbar
              commands={ zhCommands }
              extraCommands={ [...tocCommand, ...zhExtraCommands] }
              previewOptions={ {
                remarkPlugins: [remarkGfm, [remarkToc, { heading: "目录" }], remarkToc],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                  rehypeHighlight,
                ],
              } }
              textareaProps={ { placeholder: "在此输入 Markdown…", spellCheck: false, autoFocus: true } }
              onChange={ ( v ) => setValue( v || "" ) }
            />
          </section>
          { showToc && (
            <div className="h-full pointer-events-auto top-22 z-50 w-36 overflow-auto border-y bg-background p-3 shadow-lg dark:border-neutral-800">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">目录</h3>
                <button className="rounded border px-2 py-0.5 text-xs dark:border-neutral-800 cursor-pointer" onClick={ () => setShowToc( false ) }>关闭</button>
              </div>
              <nav className="space-y-1 text-sm">
                { toc.length === 0 && <div className="text-neutral-500">暂无标题</div> }
                { toc.map( ( h ) => (
                  <a
                    key={ h.text + h.depth }
                    href={ "#" + h.id }
                    className={ `block truncate hover:underline ${ h.depth === 2 ? "ml-0" : h.depth === 3 ? "ml-3" : "ml-5" }` }
                    title={ h.text }
                  >
                    { h.text }
                  </a>
                ) ) }
              </nav>
            </div>
          ) }
        </div>
        <div className="h-10 px-4 py-2 flex items-center justify-between text-sm text-neutral-500 border-t dark:border-neutral-800">
          <p>* 每隔30秒自动保存一次</p>
          <p>{ value.split( "\n" ).length } 行, 共 { value.length } 字</p>
        </div>
      </div>
    </div>
  );
}