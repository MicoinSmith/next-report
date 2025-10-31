"use client";

import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";

const Input = forwardRef(
  (
    {
      className = "",
      size = "default",
      variant = "default",
      theme: themeProp,
      ...props
    },
    ref
  ) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    const baseClasses = variant === "ghost"
      ? "flex w-full rounded-md text-xs transition-colors outline-none disabled:pointer-events-none disabled:opacity-50"
      : "flex w-full rounded-md text-xs transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const sizeClasses = {
      default: "h-8 px-3 py-1.5",
      sm: "h-7 px-2 text-[10px]",
      xs: "h-6 px-1 text-[10px]",
      lg: "h-9 px-4",
    };

    const variantClasses = {
      default: theme === "dark"
        ? "border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-neutral-700 focus-visible:ring-neutral-800"
        : "border border-gray-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-300 focus-visible:ring-neutral-200",
      ghost: theme === "dark"
        ? "bg-transparent text-neutral-200 placeholder:text-neutral-500 hover:bg-neutral-800"
        : "bg-transparent text-neutral-900 placeholder:text-neutral-400 hover:bg-neutral-100",
    };

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
