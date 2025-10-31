"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";

const Root = DropdownMenu.Root;
const Trigger = DropdownMenu.Trigger;
const Portal = DropdownMenu.Portal;
const Content = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <Portal>
      <DropdownMenu.Content
        ref={ref}
        className={`
          min-w-[160px] rounded-md border shadow-lg p-1 z-50
          animate-in fade-in-0 zoom-in-95 transition-colors
          ${theme === "dark"
            ? "border-neutral-800 bg-neutral-900"
            : "border-neutral-200 bg-white"
          }
          ${className}
        `}
        sideOffset={5}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </Portal>
  );
});
Content.displayName = "MenuContent";

const Item = forwardRef(
  ({ className = "", theme: themeProp, children, disabled, ...props }, ref) => {
    const { theme: globalTheme } = useTheme();
    const theme = themeProp || globalTheme || "light";

    return (
      <DropdownMenu.Item
        ref={ref}
        disabled={disabled}
        className={`
          relative flex items-center gap-2 px-3 py-2 text-xs rounded-md cursor-pointer
          select-none outline-none focus-visible:outline-none transition-colors
          disabled:opacity-50 disabled:pointer-events-none
          ${theme === "dark"
            ? "text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800 focus-visible:bg-neutral-800"
            : "text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:bg-neutral-100"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </DropdownMenu.Item>
    );
  }
);
Item.displayName = "MenuItem";

const Separator = forwardRef(({ className = "", theme: themeProp, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <DropdownMenu.Separator
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
Separator.displayName = "MenuSeparator";

const Label = forwardRef(({ className = "", theme: themeProp, children, ...props }, ref) => {
  const { theme: globalTheme } = useTheme();
  const theme = themeProp || globalTheme || "light";

  return (
    <DropdownMenu.Label
      ref={ref}
        className={`
          px-3 py-1.5 text-xs font-semibold transition-colors
          ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}
          ${className}
        `}
      {...props}
    >
      {children}
    </DropdownMenu.Label>
  );
});
Label.displayName = "MenuLabel";

const Sub = DropdownMenu.Sub;
const SubTrigger = forwardRef(({ className = "", children, ...props }, ref) => (
  <DropdownMenu.SubTrigger
    ref={ref}
    className={`
      relative flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer
      select-none outline-none focus-visible:outline-none
      text-neutral-700 dark:text-neutral-200
      hover:bg-neutral-100 dark:hover:bg-neutral-800
      focus:bg-neutral-100 dark:focus:bg-neutral-800
      focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-800
      ${className}
    `}
    {...props}
  >
    {children}
  </DropdownMenu.SubTrigger>
));
SubTrigger.displayName = "MenuSubTrigger";

const SubContent = forwardRef(({ className = "", children, ...props }, ref) => (
  <DropdownMenu.SubContent
    ref={ref}
    className={`
      min-w-[160px] rounded-md border border-neutral-200 dark:border-neutral-800
      bg-white dark:bg-neutral-900
      shadow-lg p-1 z-50
      animate-in fade-in-0 zoom-in-95
      ${className}
    `}
    sideOffset={5}
    {...props}
  >
    {children}
  </DropdownMenu.SubContent>
));
SubContent.displayName = "MenuSubContent";

const CheckboxItem = forwardRef(
  ({ className = "", children, checked, ...props }, ref) => (
    <DropdownMenu.CheckboxItem
      ref={ref}
      checked={checked}
      className={`
        relative flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer
        select-none outline-none
        text-neutral-700 dark:text-neutral-200
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        focus:bg-neutral-100 dark:focus:bg-neutral-800
        ${className}
      `}
      {...props}
    >
      {children}
    </DropdownMenu.CheckboxItem>
  )
);
CheckboxItem.displayName = "MenuCheckboxItem";

const RadioGroup = DropdownMenu.RadioGroup;

const RadioItem = forwardRef(
  ({ className = "", children, ...props }, ref) => (
    <DropdownMenu.RadioItem
      ref={ref}
      className={`
        relative flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer
        select-none outline-none
        text-neutral-700 dark:text-neutral-200
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        focus:bg-neutral-100 dark:focus:bg-neutral-800
        ${className}
      `}
      {...props}
    >
      {children}
    </DropdownMenu.RadioItem>
  )
);
RadioItem.displayName = "MenuRadioItem";

const Menu = Object.assign(Root, {
  Trigger,
  Content,
  Item,
  Separator,
  Label,
  Sub,
  SubTrigger,
  SubContent,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Portal,
});

export default Menu;

// Named exports for convenience
export {
  Root as MenuRoot,
  Trigger as MenuTrigger,
  Content as MenuContent,
  Item as MenuItem,
  Separator as MenuSeparator,
  Label as MenuLabel,
  Sub as MenuSub,
  SubTrigger as MenuSubTrigger,
  SubContent as MenuSubContent,
  CheckboxItem as MenuCheckboxItem,
  RadioGroup as MenuRadioGroup,
  RadioItem as MenuRadioItem,
  Portal as MenuPortal,
};
