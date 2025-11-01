"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Check, ChevronRight } from "lucide-react";

const Root = DropdownMenuPrimitive.Root;
const Group = DropdownMenuPrimitive.Group;
const Portal = DropdownMenuPrimitive.Portal;
const Sub = DropdownMenuPrimitive.Sub;
const RadioGroup = DropdownMenuPrimitive.RadioGroup;

const Trigger = DropdownMenuPrimitive.Trigger;
Trigger.displayName = "DropdownMenuTrigger";

const Content = forwardRef(({ className = "", theme: themeProp, size = "default", children, sideOffset = 5, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  const paddingClasses = {
    xs: "p-0.5",
    sm: "p-0.5",
    default: "p-1",
    lg: "p-1.5",
  };

  return (
    <Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={`
          min-w-[160px] rounded-md border shadow-lg z-50 focus:outline-none focus-visible:outline-none
          animate-in fade-in-0 zoom-in-95 transition-colors
          ${paddingClasses[size]}
          ${theme === "dark"
            ? "border-neutral-800 bg-neutral-900"
            : "border-neutral-200 bg-white"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </Portal>
  );
});
Content.displayName = "DropdownMenuContent";

const Item = forwardRef(
  ({ className = "", theme: themeProp, size = "default", children, disabled, ...props }, ref) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    const sizeClasses = {
      xs: "px-2 py-1 text-[10px]",
      sm: "px-2.5 py-1.5 text-[11px]",
      default: "px-3 py-2 text-xs",
      lg: "px-4 py-2.5 text-sm",
    };

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        disabled={disabled}
        className={`
          relative flex items-center gap-2 rounded-md cursor-pointer
          select-none outline-none focus-visible:outline-none transition-colors
          disabled:opacity-50 disabled:pointer-events-none
          ${sizeClasses[size]}
          ${theme === "dark"
            ? "text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800 focus-visible:bg-neutral-800"
            : "text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:bg-neutral-100"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Item>
    );
  }
);
Item.displayName = "DropdownMenuItem";

const CheckboxItem = forwardRef(
  ({ className = "", theme: themeProp, size = "default", children, checked, ...props }, ref) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    const sizeClasses = {
      xs: "px-2 py-1 pl-6 text-[10px]",
      sm: "px-2.5 py-1.5 pl-7 text-[11px]",
      default: "px-3 py-2 pl-8 text-xs",
      lg: "px-4 py-2.5 pl-9 text-sm",
    };

    const iconSizes = {
      xs: "h-3 w-3 left-1.5",
      sm: "h-3.5 w-3.5 left-2",
      default: "h-3.5 w-3.5 left-2",
      lg: "h-4 w-4 left-2.5",
    };

    const checkSizes = {
      xs: "h-3 w-3",
      sm: "h-3.5 w-3.5",
      default: "h-4 w-4",
      lg: "h-4 w-4",
    };

    return (
      <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        checked={checked}
        className={`
          relative flex items-center gap-2 rounded-md cursor-pointer
          select-none outline-none focus-visible:outline-none transition-colors
          ${sizeClasses[size]}
          ${theme === "dark"
            ? "text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800 focus-visible:bg-neutral-800"
            : "text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:bg-neutral-100"
          }
          ${className}
        `}
        {...props}
      >
        <span className={`absolute ${iconSizes[size]} flex items-center justify-center`}>
          <DropdownMenuPrimitive.ItemIndicator>
            <Check className={checkSizes[size]} />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    );
  }
);
CheckboxItem.displayName = "DropdownMenuCheckboxItem";

const RadioItem = forwardRef(
  ({ className = "", theme: themeProp, size = "default", children, ...props }, ref) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    const sizeClasses = {
      xs: "px-2 py-1 pl-6 text-[10px]",
      sm: "px-2.5 py-1.5 pl-7 text-[11px]",
      default: "px-3 py-2 pl-8 text-xs",
      lg: "px-4 py-2.5 pl-9 text-sm",
    };

    const iconSizes = {
      xs: "h-3 w-3 left-1.5",
      sm: "h-3.5 w-3.5 left-2",
      default: "h-3.5 w-3.5 left-2",
      lg: "h-4 w-4 left-2.5",
    };

    const dotSizes = {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      default: "h-2 w-2",
      lg: "h-2.5 w-2.5",
    };

    return (
      <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={`
          relative flex items-center gap-2 rounded-md cursor-pointer
          select-none outline-none focus-visible:outline-none transition-colors
          ${sizeClasses[size]}
          ${theme === "dark"
            ? "text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800 focus-visible:bg-neutral-800"
            : "text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:bg-neutral-100"
          }
          ${className}
        `}
        {...props}
      >
        <span className={`absolute ${iconSizes[size]} flex items-center justify-center`}>
          <DropdownMenuPrimitive.ItemIndicator>
            <div className={`${dotSizes[size]} rounded-full bg-current`} />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.RadioItem>
    );
  }
);
RadioItem.displayName = "DropdownMenuRadioItem";

const Label = forwardRef(({ className = "", theme: themeProp, size = "default", children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  const sizeClasses = {
    xs: "px-2 py-1 text-[10px]",
    sm: "px-2.5 py-1 text-[11px]",
    default: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={`
        font-semibold transition-colors
        ${sizeClasses[size]}
        ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}
        ${className}
      `}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
});
Label.displayName = "DropdownMenuLabel";

const Separator = forwardRef(({ className = "", theme: themeProp, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={`
        h-px my-1 transition-colors
        ${theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"}
        ${className}
      `}
      {...props}
    />
  );
});
Separator.displayName = "DropdownMenuSeparator";

const SubTrigger = forwardRef(({ className = "", theme: themeProp, size = "default", children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  const sizeClasses = {
    xs: "px-2 py-1 text-[10px]",
    sm: "px-2.5 py-1.5 text-[11px]",
    default: "px-3 py-2 text-xs",
    lg: "px-4 py-2.5 text-sm",
  };

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-4 w-4",
  };

  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={`
        relative flex items-center justify-between gap-2 rounded-md cursor-pointer
        select-none outline-none focus-visible:outline-none transition-colors
        ${sizeClasses[size]}
        ${theme === "dark"
          ? "text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800 focus-visible:bg-neutral-800"
          : "text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:bg-neutral-100"
        }
        ${className}
      `}
      {...props}
    >
      {children}
      <ChevronRight className={`${iconSizes[size]} ml-auto`} />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
SubTrigger.displayName = "DropdownMenuSubTrigger";

const SubContent = forwardRef(({ className = "", theme: themeProp, size = "default", children, sideOffset = 5, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  const paddingClasses = {
    xs: "p-0.5",
    sm: "p-0.5",
    default: "p-1",
    lg: "p-1.5",
  };

  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={sideOffset}
      className={`
        min-w-[160px] rounded-md border shadow-lg z-50
        animate-in fade-in-0 zoom-in-95 transition-colors
        ${paddingClasses[size]}
        ${theme === "dark"
          ? "border-neutral-800 bg-neutral-900"
          : "border-neutral-200 bg-white"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  );
});
SubContent.displayName = "DropdownMenuSubContent";

const DropdownMenu = Object.assign(Root, {
  Trigger,
  Content,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Label,
  Separator,
  Group,
  Sub,
  SubTrigger,
  SubContent,
  Portal,
});

export default DropdownMenu;

// Named exports for convenience
export {
  Root as DropdownMenuRoot,
  Trigger as DropdownMenuTrigger,
  Content as DropdownMenuContent,
  Item as DropdownMenuItem,
  CheckboxItem as DropdownMenuCheckboxItem,
  RadioGroup as DropdownMenuRadioGroup,
  RadioItem as DropdownMenuRadioItem,
  Label as DropdownMenuLabel,
  Separator as DropdownMenuSeparator,
  Group as DropdownMenuGroup,
  Sub as DropdownMenuSub,
  SubTrigger as DropdownMenuSubTrigger,
  SubContent as DropdownMenuSubContent,
  Portal as DropdownMenuPortal,
};
