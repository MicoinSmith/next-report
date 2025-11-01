"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import Dialog, { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
import Button from "./Button";
import { useTheme } from "@/hooks/useTheme";

const MessageContext = createContext(null);
let messageId = 0;

// 全局 Message 对象，用于直接调用
const globalMessage = {
  success: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
  error: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
  warning: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
  info: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
  confirm: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
  showMessage: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
  removeMessage: () => {
    console.warn("Message API 尚未初始化，请确保已使用 MessageProvider 包裹应用");
  },
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

function MessageItem({ id, content, type = "info", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = icons[type] || icons.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
  };

  return (
    <div
      className={`
        flex items-start gap-2 rounded-md border p-2 shadow-md backdrop-blur-sm
        ${typeStyles[type]}
        transition-all duration-300 ease-in-out
        ${isLeaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
      role="alert"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium break-words">{content}</p>
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="关闭提示"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function MessageContainer({ messages, onClose }) {
  if (!messages || messages.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-1.5 w-full max-w-xs pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {messages.map((message) => (
        <div key={message.id} className="pointer-events-auto">
          <MessageItem {...message} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({ open, onOpenChange, content, title = "确认", type = "warning", position = "top", onOk, onCancel }) {
  const Icon = icons[type] || icons.warning;
  const typeStyles = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    info: "text-blue-600 dark:text-blue-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const positionClasses = {
    top: "!top-[12%] !-translate-y-1/4",
    center: "!top-1/2 !-translate-y-1/2",
    bottom: "!top-[75%] !-translate-y-3/4",
  };

  const getBorderColor = (type) => {
    const borderColors = {
      success: { color: "rgb(34 197 94)", rgba: "rgba(34, 197, 94, " },
      error: { color: "rgb(239 68 68)", rgba: "rgba(239, 68, 68, " },
      warning: { color: "rgb(234 179 8)", rgba: "rgba(234, 179, 8, " },
      info: { color: "rgb(59 130 246)", rgba: "rgba(59, 130, 246, " },
      danger: { color: "rgb(239 68 68)", rgba: "rgba(239, 68, 68, " },
    };
    const colors = borderColors[type] || borderColors.warning;
    return { colors, className: "border-2" };
  };

  const handleOk = async () => {
    if (onOk) {
      await onOk();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const borderStyle = getBorderColor(type);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes breathing-border {
            0%, 100% {
              border-color: ${borderStyle.colors.rgba}1);
            }
            50% {
              border-color: ${borderStyle.colors.rgba}0.4);
            }
          }
          .animate-breathing-border-${type} {
            animation: breathing-border 2s ease-in-out infinite;
          }
        `
      }} />
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-md ${positionClasses[position] || positionClasses.top} ${borderStyle.className} animate-breathing-border-${type}`}
        style={{ borderColor: borderStyle.colors.color }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 shrink-0 ${typeStyles[type]}`} />
            <DialogTitle>{title}</DialogTitle>
          </div>
          {content && <DialogDescription className="mt-2">{content}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} size="sm">
            取消
          </Button>
          <Button variant="outline" onClick={handleOk} size="sm" className={`${typeStyles[type]}`}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [confirmState, setConfirmState] = useState({
    open: false,
    content: "",
    title: "确认",
    type: "warning",
    position: "top",
    onOk: null,
    onCancel: null,
  });

  const showMessage = useCallback((content, type = "info", options = {}) => {
    const id = ++messageId;
    const newMessage = {
      id,
      content,
      type,
      duration: options.duration ?? 3000,
      ...options,
    };

    setMessages((prev) => [...prev, newMessage]);

    return id;
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const success = useCallback(
    (content, options) => showMessage(content, "success", options),
    [showMessage]
  );

  const error = useCallback(
    (content, options) => showMessage(content, "error", options),
    [showMessage]
  );

  const warning = useCallback(
    (content, options) => showMessage(content, "warning", options),
    [showMessage]
  );

  const info = useCallback(
    (content, options) => showMessage(content, "info", options),
    [showMessage]
  );

  const confirm = useCallback((content, title = "确认", options = {}) => {
    setConfirmState({
      open: true,
      content,
      title,
      type: options.type || "warning",
      position: options.position || "top",
      onOk: options.onOk || null,
      onCancel: options.onCancel || null,
    });
  }, []);

  const value = {
    showMessage,
    success,
    error,
    warning,
    info,
    confirm,
    removeMessage,
  };

  // 立即将方法注册到全局对象（同步）
  globalMessage.success = success;
  globalMessage.error = error;
  globalMessage.warning = warning;
  globalMessage.info = info;
  globalMessage.confirm = confirm;
  globalMessage.showMessage = showMessage;
  globalMessage.removeMessage = removeMessage;

  // 挂载到 window 对象，可以在任何地方直接使用 Message
  if (typeof window !== 'undefined') {
    window.Message = globalMessage;
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
      <MessageContainer messages={messages} onClose={removeMessage} />
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        content={confirmState.content}
        title={confirmState.title}
        type={confirmState.type}
        position={confirmState.position}
        onOk={confirmState.onOk}
        onCancel={confirmState.onCancel}
      />
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
}

// 导出全局 Message 对象，可以在任何地方直接使用
export { globalMessage as Message };
