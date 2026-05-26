"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, forwardRef } from "react";

// ─── Button ───
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "sm" | "default" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/25 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
          "disabled:pointer-events-none disabled:opacity-40",
          "select-none",
          variant === "default" &&
            "rounded-lg bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300",
          variant === "secondary" &&
            "rounded-lg bg-terracotta-500 text-white hover:bg-terracotta-600 active:bg-terracotta-700",
          variant === "outline" &&
            "rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600",
          variant === "ghost" &&
            "rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200",
          variant === "destructive" &&
            "rounded-lg bg-rust-500 text-white hover:bg-rust-600 active:bg-rust-700",
          size === "sm" && "h-8 px-3 text-xs gap-1.5",
          size === "default" && "h-10 px-4 text-sm gap-2",
          size === "lg" && "h-12 px-6 text-base gap-2",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─── Input ───
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-neutral-900 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400",
            "disabled:cursor-not-allowed disabled:bg-neutral-800/50 disabled:text-neutral-400",
            "border-neutral-700 hover:border-neutral-600",
            error
              ? "border-rust-700 focus:ring-rust-500/15 focus:border-rust-400"
              : "border-neutral-700 hover:border-neutral-600",
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
        {error && <p className="text-xs text-rust-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Textarea ───
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 transition-all resize-y",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400",
            "disabled:cursor-not-allowed disabled:bg-neutral-800/50",
            "border-neutral-700 hover:border-neutral-600",
            error
              ? "border-rust-700"
              : "border-neutral-700 hover:border-neutral-600",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-rust-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ─── Card ───
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-800 bg-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between px-5 pt-5 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Badge ───
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "accent";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide",
        variant === "default" && "bg-neutral-800 text-neutral-300",
        variant === "success" && "bg-forest-900/30 text-forest-300",
        variant === "warning" && "bg-amber-900/30 text-amber-400",
        variant === "danger" && "bg-rust-900/30 text-rust-300",
        variant === "info" && "bg-blue-900/30 text-blue-300",
        variant === "accent" && "bg-terracotta-900/30 text-terracotta-300",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── Avatar ───
interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const sizeClasses = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
    xl: "h-14 w-14 text-base",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-neutral-800 ring-1 ring-neutral-700",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name || ""} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span className="font-semibold text-neutral-500">{initials}</span>
      )}
    </div>
  );
}

// ─── DropdownMenu ───
interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(!open); }} className="focus:outline-none">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 min-w-[180px] overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 py-1 shadow-sm animate-scale-in",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.separator && i > 0 && (
                <div className="my-1 border-t border-neutral-700" />
              )}
              <button
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors",
                  item.disabled && "opacity-40 cursor-not-allowed",
                  item.danger
                    ? "text-rust-400 hover:bg-rust-900/20"
                    : "text-neutral-300 hover:bg-neutral-700/50",
                )}
              >
                {item.icon && <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ───
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse-soft rounded-md bg-neutral-800",
        className,
      )}
    />
  );
}

// ─── Tabs ───
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  const handleChange = (tabId: string) => {
    setActive(tabId);
    onChange?.(tabId);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleChange(tab.id)}
            className={cn(
              "px-4 pb-2.5 pt-2 text-sm font-medium transition-all relative",
              active === tab.id
                ? "text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300",
            )}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-terracotta-500" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}

// ─── Select ───
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

export function Select({ className, label, options, id, onChange, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "flex h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2 pr-9 text-sm text-neutral-100 transition-all appearance-none",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400",
            className,
          )}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

// ─── Dialog ───
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg animate-scale-in rounded-xl border border-neutral-700 bg-neutral-800 p-6 shadow-xl"
      >
        {title && (
          <h2 className="text-base font-semibold text-neutral-100 mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── Toggle ───
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer", disabled && "opacity-40 cursor-not-allowed")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/25 focus-visible:ring-offset-2",
          checked
            ? "bg-terracotta-500"
            : "bg-neutral-700",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
      {label && <span className="text-sm text-neutral-400">{label}</span>}
    </label>
  );
}

// ─── EmptyState ───
interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
      )}
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ─── Stat ───
interface StatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

export function Stat({ label, value, icon, trend }: StatProps) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        {icon && <div className="text-neutral-700">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="text-2xl font-bold tracking-tight text-neutral-50">
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-forest-400" : "text-rust-400",
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Divider ───
export function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t border-neutral-800", className)} />;
}

// ─── SectionHeading ───
interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
