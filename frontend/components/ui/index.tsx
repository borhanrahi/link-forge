"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, forwardRef } from "react";
import { Loader2 } from "lucide-react";

// ─── Button ───
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "primary";
  size?: "sm" | "default" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
          "disabled:pointer-events-none disabled:opacity-40",
          "select-none active:scale-[0.97]",
          variant === "primary" &&
            "rounded-lg bg-terracotta-500 text-white shadow-sm shadow-terracotta-500/20 hover:bg-terracotta-600 hover:shadow-terracotta-500/30 active:bg-terracotta-700",
          variant === "default" &&
            "rounded-lg bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 active:bg-neutral-300",
          variant === "secondary" &&
            "rounded-lg bg-neutral-800 text-neutral-200 shadow-sm hover:bg-neutral-700 active:bg-neutral-600 border border-neutral-700",
          variant === "outline" &&
            "rounded-lg border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600",
          variant === "ghost" &&
            "rounded-lg text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200",
          variant === "destructive" &&
            "rounded-lg bg-rust-500/10 text-rust-300 border border-rust-800/40 shadow-sm hover:bg-rust-500/20 hover:border-rust-700/50 active:bg-rust-500/30",
          size === "sm" && "h-8 px-3 text-xs gap-1.5",
          size === "default" && "h-10 px-4 text-sm gap-2",
          size === "lg" && "h-12 px-6 text-base gap-2",
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
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
            "flex h-10 w-full rounded-lg border bg-neutral-900/50 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400 focus:bg-neutral-900",
            "disabled:cursor-not-allowed disabled:bg-neutral-800/30 disabled:text-neutral-500",
            error
              ? "border-rust-700 focus:ring-rust-500/15 focus:border-rust-400"
              : "border-neutral-700/70 hover:border-neutral-600",
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
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-800/80 bg-neutral-900/80 shadow-sm backdrop-blur-sm",
        hover && "transition-all duration-200 hover:border-neutral-700 hover:shadow-md hover:shadow-neutral-900/50",
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
  dot?: boolean;
}

export function Badge({ className, variant = "default", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variant === "default" && "bg-neutral-800 text-neutral-300",
        variant === "success" && "bg-forest-900/30 text-forest-300 ring-1 ring-forest-800/30",
        variant === "warning" && "bg-amber-900/30 text-amber-400 ring-1 ring-amber-800/30",
        variant === "danger" && "bg-rust-900/30 text-rust-300 ring-1 ring-rust-800/30",
        variant === "info" && "bg-blue-900/30 text-blue-300 ring-1 ring-blue-800/30",
        variant === "accent" && "bg-terracotta-900/30 text-terracotta-300 ring-1 ring-terracotta-800/30",
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "success" && "bg-forest-400",
          variant === "warning" && "bg-amber-400",
          variant === "danger" && "bg-rust-400",
          variant === "accent" && "bg-terracotta-400",
          variant === "info" && "bg-blue-400",
          variant === "default" && "bg-neutral-500",
        )} />
      )}
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
      <div className="flex gap-1 rounded-lg bg-neutral-900/50 p-1 border border-neutral-800/80">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleChange(tab.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              active === tab.id
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-500 hover:text-neutral-300",
            )}
          >
            {tab.label}
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
            "flex h-10 w-full rounded-lg border border-neutral-700/70 bg-neutral-900/50 px-3.5 py-2 pr-9 text-sm text-neutral-100 transition-all appearance-none",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400 focus:bg-neutral-900",
            className,
          )}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"
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
      <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg animate-scale-in rounded-xl border border-neutral-700/50 bg-neutral-900 p-6 shadow-2xl shadow-neutral-950"
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-100">{title}</h2>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
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
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", disabled && "opacity-40")}>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <p className="text-sm font-medium text-neutral-200">{label}</p>}
          {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/25 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
          checked
            ? "bg-terracotta-500"
            : "bg-neutral-700",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    </div>
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
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-neutral-700/50 bg-neutral-800/30">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
      )}
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500 leading-relaxed">{description}</p>
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
  accent?: boolean;
}

export function Stat({ label, value, icon, trend, accent }: StatProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border bg-neutral-900/80 p-5",
      accent
        ? "border-terracotta-800/30 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-terracotta-500/40 before:via-terracotta-400 before:to-terracotta-500/40"
        : "border-neutral-800/80",
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        {icon && <div className="text-neutral-600">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="text-2xl font-bold tracking-tight text-neutral-50">
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              trend.positive ? "bg-forest-900/20 text-forest-400" : "bg-rust-900/20 text-rust-400",
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
        <h2 className="text-xl font-semibold tracking-tight text-neutral-50">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
