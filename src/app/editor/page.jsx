"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
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
import { FileDown, Settings, Loader2 } from "lucide-react";
import modelList from "@/assets/modelList.json";
import { Button, Menu, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, MDEditor, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Input, Checkbox } from "@/components/ui";
import { api } from "@/HTTP/api";

// 导出工具函数（供头部按钮与弹层复用）
const exportMarkdownToMD = ( markdown ) => {
  const blob = new Blob( [markdown], { type: "text/markdown;charset=utf-8" } );
  const url = URL.createObjectURL( blob );
  const a = document.createElement( "a" );
  a.href = url;
  a.download = "report.md";
  a.click();
  URL.revokeObjectURL( url );
};

const exportMarkdownToHTML = ( markdown ) => {
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
  const b64 = btoa( unescape( encodeURIComponent( markdown ) ) );
  const html = tpl.replace( '__B64__', b64 );
  const blob = new Blob( [html], { type: 'text/html;charset=utf-8' } );
  const url = URL.createObjectURL( blob );
  const a = document.createElement( 'a' );
  a.href = url;
  a.download = 'report.html';
  a.click();
  URL.revokeObjectURL( url );
};

const exportMarkdownToPDF = ( markdown ) => {
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
  const b64 = btoa( unescape( encodeURIComponent( markdown ) ) );
  const html = tpl.replace( '__B64__', b64 );
  const win = window.open( '', '_blank' );
  if ( win ) {
    win.document.open();
    win.document.write( html );
    win.document.close();
  }
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

// 将大纲数据转换为 Markdown 格式
const planToMarkdown = ( plan ) => {
  if ( !plan || !Array.isArray( plan ) || plan.length === 0 ) {
    return "";
  }

  let markdown = "# 大纲\n\n";

  plan.forEach( ( item ) => {
    const { step, title, description } = item;
    // 使用二级标题，格式：## 1. Title
    markdown += `## ${ step }. ${ title }\n\n`;
    // 描述作为段落
    if ( description ) {
      markdown += `${ description }\n\n`;
    }
  } );

  return markdown.trim();
}

// main export
export default function Editor() {
  const { theme, setTheme, mounted } = useTheme(); // 现在可以访问主题，用于将来扩展功能
  const [value, setValue] = useState( "" );
  const [showToc, setShowToc] = useState( false );
  const [modelConfig, setModelConfig] = useState( { provider: "openai", model: "gpt-4" } );
  const [showModelConfigDialog, setShowModelConfigDialog] = useState( false );
  const [modelConfigForm, setModelConfigForm] = useState( { model: null, key: null } );

  const [filesList, setFilesList] = useState( [] );

  const [showGeneratePlanDialog, setShowGeneratePlanDialog] = useState( false );
  const [generatePlanTitle, setGeneratePlanTitle] = useState( null );
  const [generatePlanSource, setGeneratePlanSource] = useState( null );
  const [generatePlanSourceFilesPaths, setGeneratePlanSourceFilesPaths] = useState( [] );

  // 内容生成
  const [generateLoading, setGenerateLoading] = useState( false );
  const initializedRef = useRef( false );
  const STORAGE_KEY = "editor-content";
  useEffect( () => {
    const cached = typeof window !== "undefined" ? localStorage.getItem( STORAGE_KEY ) : null;
    if ( cached && !initializedRef.current ) {
      setValue( cached );
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
      } catch { }
    } )();
    return () => {
      cancelled = true;
    };
  }, [] );
  useEffect( () => {
    try {
      if ( typeof window !== "undefined" ) {
        localStorage.setItem( STORAGE_KEY, value || "" );
      }
    } catch { }
  }, [value] );

  const toc = useMemo( () => extractHeadings( value ), [value] );
  const tocCommand = useMemo( () => [{
    name: "toc",
    keyCommand: "toc",
    buttonProps: { title: "目录 (TOC)", "aria-label": "目录" },
    icon: <span style={ { fontSize: 12, fontWeight: 500, verticalAlign: "top", display: "inline-block", transform: "translateY(-1px)", color: showToc ? "inherit" : "var(--color-white)" } }>TOC</span>,
    execute: () => setShowToc( ( v ) => !v ),
  }], [] );

  const handleSaveModelConfig = async ( apiKey ) => {
    console.log( '保存模型配置', modelConfigForm );
    Message.warning( '保存模型配置功能待实现' );
    // const response = await api.saveModelConfig(modelConfigForm);
    // if (response.status === 'success') {
    //   Message.success('模型配置保存成功!');
    // } else {
    //   Message.error('模型配置保存失败!');
    // }
  }

  const handleGenerate = async ( type, isCallback = false ) => {
    if ( type === 'generatePlan' ) {
      if(!isCallback || !generatePlanTitle || !generatePlanSource || (generatePlanSource === 'file' && !generatePlanSourceFilesPaths) ) {
        const showMessage = () => {
          Message.info( '请填写或完整信息' );
          setShowGeneratePlanDialog( true );
        }
        if(isCallback) {
          setTimeout(() => {
            showMessage();
          }, 500);
        } else {
          showMessage();
        }
        return
      }

      setGenerateLoading( true );

      let params = {
        topic: generatePlanTitle,
        source: {
          type: generatePlanSource,
        }
      }
      if(params.source.type === 'files') {
        params = {
          ...params,
          source: {
            ...params.source,
            paths: generatePlanSourceFilesPaths
          }
        }
      }

      // 调用生成大纲接口
      const res = await api.generatePlan( params );

      // 检查响应是否包含 plan 数组
      if ( res && res.plan && Array.isArray( res.plan ) ) {
        // 将大纲转换为 Markdown
        const markdown = planToMarkdown( res.plan );

        // 将 Markdown 插入到编辑器
        // 如果当前有内容，在后面追加；如果没有内容，直接设置
        if ( value && value.trim() ) {
          setValue( markdown );
          Message.success( '内容已更新!' );
          setGeneratePlanTitle( null );
          setGeneratePlanSource( null );
          setGeneratePlanSourceFilesPaths( [] );
        }
      } else {
        Message.error( res?.message || res?.error || "生成失败!" );
      }
    } else if ( type === 'generateMaterial' ) {
      // TODO: 实现批量生成素材
      console.log( '批量生成素材功能待实现' );
    } else if ( type === 'synthesizeArticle' ) {
      // TODO: 实现一键整篇插入
      console.log( '一键整篇插入功能待实现' );
    }
    setGenerateLoading( false );
  }

  const updateFilesList = ( files ) => {
    setFilesList( files );
  }

  const handleSelectFile = ( filepath ) => {
    setGeneratePlanSourceFilesPaths( prev => prev.includes( filepath ) ? prev.filter( path => path !== filepath ) : [...prev, filepath] );
  }

  return (
    <div className="flex w-full h-[calc(100vh-48px)]">
      {/* 左侧：Topic / 数据源 / 生成大纲 */ }
      <LeftPanel onGenerate={ handleGenerate } updateFilesList={ updateFilesList } />

      {/* 内容区 */ }
      <div className="h-full flex flex-1 flex-col">
        <div className="header h-12 flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">标题</h2>
          <div className="relative flex items-center gap-2">
            { generateLoading && (
              <Loader2 className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-spin" />
            ) }

            <Menu>
              <Menu.Trigger className={ `rounded-md border px-2 py-1 text-xs flex items-center gap-1 cursor-pointer transition-colors ${ theme === "dark" ? "border-neutral-600 hover:bg-neutral-900" : "border-gray-200 hover:bg-neutral-100" }` }>
                <Settings className="w-3 h-3" />
                <span className="ml-1">{ modelConfig.model || "选择模型" }</span>
              </Menu.Trigger>
              <Menu.Content>
                { Object.entries( modelList ).map( ( [provider, models], providerIndex ) => {
                  // 支持数组和对象两种格式
                  const modelArray = Array.isArray( models )
                    ? models
                    : Object.values( models );

                  return (
                    <div key={ provider }>
                      <Menu.Label className="uppercase">
                        { provider }
                      </Menu.Label>
                      { modelArray.map( ( model, modelIndex ) => (
                        <Menu.Item
                          key={ `${ provider }-${ modelIndex }` }
                          onSelect={ () => {
                            setModelConfig( { provider, model: model.name } );
                          } }
                        >
                          { model.name }
                        </Menu.Item>
                      ) ) }
                      { providerIndex < Object.keys( modelList ).length - 1 && (
                        <Menu.Separator />
                      ) }
                    </div>
                  );
                } ) }
                <Menu.Separator />
                <Menu.Item onSelect={ () => setShowModelConfigDialog( true ) }>配置 API Key</Menu.Item>
              </Menu.Content>
            </Menu>

            <Menu>
              <Menu.Trigger className={ `rounded-md border px-2 py-1 text-xs flex items-center gap-1 cursor-pointer transition-colors ${ theme === "dark" ? "border-neutral-600 hover:bg-neutral-900" : "border-gray-200 hover:bg-neutral-100" }` }>
                <FileDown className="w-3 h-3" />
                <span className="ml-1">导出</span>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item onClick={ () => exportMarkdownToMD( value ) }>导出 MD</Menu.Item>
                <Menu.Item onClick={ () => exportMarkdownToHTML( value ) }>导出 HTML</Menu.Item>
                <Menu.Item onClick={ () => exportMarkdownToPDF( value ) }>导出 PDF</Menu.Item>
              </Menu.Content>
            </Menu>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden" style={ { height: 'calc(100vh - 48px - 48px - 40px)' } }>
          <section className={ `h-full flex-1 border-r ${ theme === "dark" ? "border-neutral-600" : "border-gray-200" } overflow-hidden` } style={ { height: '100%' } }>
            <div className="h-full" style={ { height: '100%' } }>
              <MDEditor
                value={ value }
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
            </div>
          </section>
          { showToc && (
            <div className={ `h-full pointer-events-auto top-22 z-50 w-36 overflow-auto border-y ${ theme === "dark" ? "border-neutral-600" : "border-gray-200" } bg-background p-3 shadow-lg` }>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">目录</h3>
                <Button variant="outline" size="sm" onClick={ () => setShowToc( false ) }>关闭</Button>
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
        <div className={ `h-10 px-4 py-2 flex items-center justify-between text-sm border-t ${ theme === "dark" ? "border-neutral-600 text-neutral-400" : "border-gray-200 text-neutral-500" }` }>
          <p>* 每隔30秒自动保存一次</p>
          <p>{ value.split( "\n" ).length } 行, 共 { value.length } 字</p>
        </div>
      </div>

      <Dialog
        open={ showModelConfigDialog }
        onOpenChange={ setShowModelConfigDialog }
      >
        <DialogContent>
          <DialogHeader className="pb-2 border-b border-gray-200 dark:border-neutral-600">
            <DialogTitle>配置 API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-nowrap">选择模型:</div>
              <Select value={ modelConfigForm.model } onValueChange={ ( value ) => setModelConfigForm( { ...modelConfigForm, model: value } ) }>
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  { Object.entries( modelList ).map( ( [provider, models], providerIndex ) => {
                    return models.map( ( model ) => (
                      <SelectItem key={ model.name } value={ model.name }>{ model.name }</SelectItem>
                    ) );
                  } ) }
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-nowrap">选择 API Key:</div>
              <Input type="text" placeholder="请输入 API Key" value={ modelConfigForm.key } onChange={ ( e ) => setModelConfigForm( { ...modelConfigForm, key: e.target.value } ) } />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={ () => setShowModelConfigDialog( false ) }>关闭</Button>
            <Button variant="outline" size="default" onClick={ () => handleSaveModelConfig() }>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ showGeneratePlanDialog } onOpenChange={ setShowGeneratePlanDialog }>
        <DialogContent className="max-w-3xl md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>生成大纲</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-nowrap">填写标题:</div>
              <Input type="text" placeholder="请输入标题" value={ generatePlanTitle } onChange={ ( e ) => setGeneratePlanTitle( e.target.value ) } />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-nowrap">选择来源:</div>
              <Select value={ generatePlanSource } onValueChange={ ( value ) => setGeneratePlanSource( value ) }>
                <SelectTrigger>
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">网络</SelectItem>
                  <SelectItem value="files">文件</SelectItem>
                </SelectContent>
              </Select>
            </div>
            { generatePlanSource == 'files' && (
              <div className="flex items-start gap-2">
                <div className="text-sm font-semibold text-nowrap">选择文件:</div>
                <div className="flex flex-col gap-2">
                  {
                    filesList.map( ( file ) => (
                      <div key={ file.id } className="flex items-center gap-2 min-w-0">
                        <Checkbox checked={ generatePlanSourceFilesPaths?.includes( file.filepath ) } id={ file.id } />
                        <label htmlFor={ file.id } className="w-120 min-w-0 max-w-120 inline-block text-sm font-semibold truncate flex-1 overflow-hidden text-ellipsis whitespace-nowrap" onClick={ () => handleSelectFile( file.filepath ) }>{ file.filename }</label>
                      </div>
                    ) )
                  }
                </div>
              </div>
            ) }
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={ () => setShowGeneratePlanDialog( false ) }>关闭</Button>
            <Button variant="outline" size="default"
              onClick={ () => {
                setShowGeneratePlanDialog( false );
                setTimeout(() => {
                  handleGenerate('generatePlan', true);
                }, 500);
              } }
            >
                生成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}