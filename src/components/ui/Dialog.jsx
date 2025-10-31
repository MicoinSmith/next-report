"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Portal = DialogPrimitive.Portal;

const Overlay = forwardRef(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`
      fixed inset-0 z-50 bg-black/20 backdrop-blur-sm
      animate-in fade-in-0
      ${className}
    `}
    {...props}
  />
));
Overlay.displayName = "DialogOverlay";

const Content = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <Portal>
      <Overlay />
      <DialogPrimitive.Content
        ref={ref}
        className={`
          fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
          rounded-lg border shadow-lg p-6 transition-colors
          animate-in fade-in-0 zoom-in-95
          focus:outline-none
          ${theme === "dark"
            ? "border-neutral-800 bg-neutral-900"
            : "border-neutral-200 bg-white"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </Portal>
  );
});
Content.displayName = "DialogContent";

const Header = forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      flex flex-col space-y-2 text-center sm:text-left
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));
Header.displayName = "DialogHeader";

const Footer = forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2
      mt-4 gap-2
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));
Footer.displayName = "DialogFooter";

const Title = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <DialogPrimitive.Title
      ref={ref}
        className={`
          text-sm font-semibold transition-colors
          ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}
          ${className}
        `}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
});
Title.displayName = "DialogTitle";

const Description = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <DialogPrimitive.Description
      ref={ref}
        className={`
          text-xs transition-colors
          ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}
          ${className}
        `}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
});
Description.displayName = "DialogDescription";

const Close = forwardRef(({ className = "", theme: themeProp, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <DialogPrimitive.Close
      ref={ref}
      className={`
        absolute right-4 top-4 rounded-sm opacity-70 transition-colors
        hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:pointer-events-none
        ${theme === "dark"
          ? "focus:ring-neutral-300"
          : "focus:ring-neutral-950"
        }
        ${className}
      `}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">关闭</span>
    </DialogPrimitive.Close>
  );
});
Close.displayName = "DialogClose";

const Dialog = Object.assign(Root, {
  Trigger,
  Portal,
  Overlay,
  Content,
  Header,
  Footer,
  Title,
  Description,
  Close,
});

export default Dialog;

// Named exports for convenience
export {
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Header as DialogHeader,
  Footer as DialogFooter,
  Title as DialogTitle,
  Description as DialogDescription,
  Close as DialogClose,
};
