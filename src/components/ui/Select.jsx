"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { forwardRef } from "react";
import { useTheme } from "next-themes";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const Root = SelectPrimitive.Root;
const Group = SelectPrimitive.Group;
const Value = SelectPrimitive.Value;

const Trigger = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <SelectPrimitive.Trigger
      ref={ref}
        className={`
          flex h-8 w-full items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-xs
          transition-colors
          placeholder:text-neutral-500
          focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none
          disabled:cursor-not-allowed disabled:opacity-50
          ${theme === "dark"
            ? "border-neutral-800 bg-neutral-900 placeholder:text-neutral-400 focus:ring-neutral-300"
            : "border-neutral-300 bg-white focus:ring-neutral-950"
          }
          ${className}
        `}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
Trigger.displayName = "SelectTrigger";

const ScrollUpButton = forwardRef(({ className = "", ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={`
      flex cursor-default items-center justify-center py-1
      ${className}
    `}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
ScrollUpButton.displayName = "SelectScrollUpButton";

const ScrollDownButton = forwardRef(({ className = "", ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={`
      flex cursor-default items-center justify-center py-1
      ${className}
    `}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
ScrollDownButton.displayName = "SelectScrollDownButton";

const Content = forwardRef(({ className = "", theme: themeProp, children, position = "popper", ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={`
          relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-lg transition-colors
          animate-in fade-in-0 zoom-in-95
          ${position === "popper" ? "translate-y-1" : ""}
          ${theme === "dark"
            ? "border-neutral-800 bg-neutral-900"
            : "border-neutral-200 bg-white"
          }
          ${className}
        `}
        {...props}
      >
        <ScrollUpButton />
        <SelectPrimitive.Viewport
          className={`
            p-1
            ${position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"}
          `}
        >
          {children}
        </SelectPrimitive.Viewport>
        <ScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
Content.displayName = "SelectContent";

const Label = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <SelectPrimitive.Label
      ref={ref}
      className={`
        py-1 pl-6 pr-2 text-[10px] font-semibold transition-colors
        ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}
        ${className}
      `}
      {...props}
    >
      {children}
    </SelectPrimitive.Label>
  );
});
Label.displayName = "SelectLabel";

const Item = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <SelectPrimitive.Item
      ref={ref}
        className={`
          relative flex w-full cursor-default select-none items-center rounded-sm py-1 pl-6 pr-2 text-xs outline-none transition-colors
          data-[disabled]:pointer-events-none data-[disabled]:opacity-50
          ${theme === "dark"
            ? "focus:bg-neutral-800"
            : "focus:bg-neutral-100"
          }
          ${className}
        `}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
Item.displayName = "SelectItem";

const Separator = forwardRef(({ className = "", theme: themeProp, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={`
        -mx-1 my-1 h-px transition-colors
        ${theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"}
        ${className}
      `}
      {...props}
    />
  );
});
Separator.displayName = "SelectSeparator";

const Select = Object.assign(Root, {
  Group,
  Value,
  Trigger,
  Content,
  Label,
  Item,
  Separator,
  ScrollUpButton,
  ScrollDownButton,
  Portal: SelectPrimitive.Portal,
});

export default Select;

// Named exports for convenience
export {
  Root as SelectRoot,
  Group as SelectGroup,
  Value as SelectValue,
  Trigger as SelectTrigger,
  Content as SelectContent,
  Label as SelectLabel,
  Item as SelectItem,
  Separator as SelectSeparator,
  ScrollUpButton as SelectScrollUpButton,
  ScrollDownButton as SelectScrollDownButton,
  Portal as SelectPortal,
};
