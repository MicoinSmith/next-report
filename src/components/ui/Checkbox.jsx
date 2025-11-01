"use client";

import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Check } from "lucide-react";

const Checkbox = forwardRef(
  (
    {
      className = "",
      size = "default",
      theme: themeProp,
      checked,
      disabled,
      label,
      children,
      ...props
    },
    ref
  ) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    const sizeClasses = {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      default: "h-4.5 w-4.5",
      lg: "h-5 w-5",
    };

    const iconSizes = {
      xs: "h-2.5 w-2.5",
      sm: "h-3 w-3",
      default: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    };

    const baseClasses = `
      relative inline-flex items-center justify-center rounded border
      transition-colors
      focus:outline-none focus-visible:outline-none
      ${sizeClasses[size]}
      ${theme === "dark"
        ? "border-neutral-700"
        : "border-gray-300"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `;

    const checkedClasses = checked
      ? theme === "dark"
        ? "bg-neutral-100 border-neutral-100"
        : "bg-neutral-900 border-neutral-900"
      : theme === "dark"
      ? "bg-neutral-900"
      : "bg-white";

    const checkboxContent = (
      <>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          className="sr-only peer"
          style={{ outline: 'none' }}
          onFocus={(e) => {
            e.target.style.outline = 'none';
            e.target.style.boxShadow = 'none';
            props.onFocus?.(e);
          }}
          {...props}
        />
        <span
          className={`${baseClasses} ${checkedClasses}`}
          aria-hidden="true"
        >
          {checked && (
            <Check className={`${iconSizes[size]} ${theme === "dark" ? "text-neutral-900" : "text-white"}`} />
          )}
        </span>
      </>
    );

    if (label || children) {
      return (
        <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
          {checkboxContent}
          {(label || children) && (
            <span className="text-xs">{label || children}</span>
          )}
        </label>
      );
    }

    return (
      <span className={`inline-flex items-center ${className}`}>
        {checkboxContent}
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
