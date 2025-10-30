// 中文工具栏配置（@uiw/react-md-editor）
import { commands } from "@uiw/react-md-editor";

export const zhCommands = [
  { ...commands.title, buttonProps: { title: "标题", "aria-label": "标题" } },
  { ...commands.bold, buttonProps: { title: "加粗 (Ctrl+B)", "aria-label": "加粗" } },
  { ...commands.italic, buttonProps: { title: "斜体 (Ctrl+I)", "aria-label": "斜体" } },
  { ...commands.strikethrough, buttonProps: { title: "删除线", "aria-label": "删除线" } },
  commands.divider,
  { ...commands.hr, buttonProps: { title: "分割线", "aria-label": "分割线" } },
  { ...commands.link, buttonProps: { title: "链接", "aria-label": "链接" } },
  { ...commands.quote, buttonProps: { title: "引用", "aria-label": "引用" } },
  { ...commands.code, buttonProps: { title: "行内代码", "aria-label": "行内代码" } },
  { ...commands.codeBlock, buttonProps: { title: "代码块", "aria-label": "代码块" } },
  { ...commands.image, buttonProps: { title: "图片", "aria-label": "图片" } },
  commands.divider,
  { ...commands.unorderedListCommand, buttonProps: { title: "无序列表", "aria-label": "无序列表" } },
  { ...commands.orderedListCommand, buttonProps: { title: "有序列表", "aria-label": "有序列表" } },
  { ...commands.checkedListCommand, buttonProps: { title: "任务列表", "aria-label": "任务列表" } },
  { ...commands.table, buttonProps: { title: "表格", "aria-label": "表格" } },
  { ...commands.split, buttonProps: { title: "拆分", "aria-label": "拆分" } },
  { ...commands.merge, buttonProps: { title: "合并", "aria-label": "合并" } },
  { ...commands.indent, buttonProps: { title: "缩进", "aria-label": "缩进" } },
  { ...commands.outdent, buttonProps: { title: "取消缩进", "aria-label": "取消缩进" } },
  { ...commands.undo, buttonProps: { title: "撤销", "aria-label": "撤销" } },
  { ...commands.redo, buttonProps: { title: "重做", "aria-label": "重做" } },
  { ...commands.preview, buttonProps: { title: "预览", "aria-label": "预览" } },
];

export const zhExtraCommands = [
  { ...commands.codeEdit, buttonProps: { title: "仅编辑", "aria-label": "仅编辑" } },
  { ...commands.codePreview, buttonProps: { title: "仅预览", "aria-label": "仅预览" } },
  { ...commands.codeLive, buttonProps: { title: "分栏预览", "aria-label": "分栏预览" } },
  { ...commands.fullscreen, buttonProps: { title: "全屏", "aria-label": "全屏" } },
];
