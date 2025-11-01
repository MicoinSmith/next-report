"use client";

import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";

const Button = forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "sm",
      theme: themeProp,
      ...props
    },
    ref
  ) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    const baseClasses = "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const sizeClasses = {
      xs: "h-6 px-1.5 text-[11px]",
      sm: "h-7 px-2 text-xs",
      default: "h-8 px-3 py-1.5",
      lg: "h-9 px-4 text-sm",
      icon: "h-8 w-8",
    };

    const variantClasses = {
      default: theme === "dark"
        ? "bg-neutral-900 text-neutral-100 hover:bg-neutral-800"
        : "bg-neutral-900 text-neutral-50 hover:bg-neutral-800",
      outline: theme === "dark"
        ? "border border-neutral-800 text-neutral-200 hover:bg-neutral-800 bg-transparent"
        : "border border-gray-200 text-neutral-900 hover:bg-neutral-100 bg-transparent",
      ghost: theme === "dark"
        ? "text-neutral-200 hover:bg-neutral-800"
        : "text-neutral-900 hover:bg-neutral-100",
      link: theme === "dark"
        ? "text-neutral-200 hover:underline underline-offset-4"
        : "text-neutral-900 hover:underline underline-offset-4",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        style={{ outline: 'none' }}
        onFocus={(e) => {
          e.target.style.outline = 'none';
          e.target.style.boxShadow = 'none';
          props.onFocus?.(e);
        }}
        onMouseDown={(e) => {
          e.target.style.outline = 'none';
          props.onMouseDown?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
            e.target.style.outline = 'none';
            e.target.style.boxShadow = 'none';
          }
          props.onKeyDown?.(e);
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
