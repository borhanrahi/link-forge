"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

// ─── Re-export all proper shadcn components ───
export { Button } from "@/components/ui/button";
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
export { Badge } from "@/components/ui/badge";
// ─── Input with label/error/hint support ───
import { Input as ShadcnInput } from "@/components/ui/input";

interface InputProps extends React.ComponentProps<typeof ShadcnInput> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = ({ label, error, hint, className, ...props }: InputProps) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-200">{label}</label>
      )}
      <ShadcnInput
        className={cn(
          "h-10 border-white/[0.08] bg-white/[0.03] backdrop-blur-xl text-white placeholder:text-white/30 focus-visible:border-terracotta-500/40 focus-visible:ring-terracotta-500/20",
          error && "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
};
export { Skeleton } from "@/components/ui/skeleton";
export { Switch } from "@/components/ui/switch";
// ─── Textarea with label/error/hint support ───
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
interface TextareaProps extends React.ComponentProps<typeof ShadcnTextarea> {
  label?: string;
  error?: string;
  hint?: string;
}
export const Textarea = ({ label, error, hint, className, ...props }: TextareaProps) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-200">{label}</label>
      )}
      <ShadcnTextarea
        className={cn(
          "border-white/[0.08] bg-white/[0.03] backdrop-blur-xl text-white placeholder:text-white/30",
          error && "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
};
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
export {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export { Separator } from "@/components/ui/separator";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export { CopyButton } from "@/components/ui/copy-button";
export { StatusBadge } from "@/components/ui/status-badge";
export { SearchInput } from "@/components/ui/search-input";
export { Sparkline } from "@/components/ui/sparkline";

// ─── Legacy Avatar (for simple use cases) ───
interface AvatarSimpleProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AvatarSimple({ src, name, size = "md", className }: AvatarSimpleProps) {
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
        "relative inline-flex items-center justify-center rounded-full bg-muted ring-1 ring-border",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name || ""} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span className="font-semibold text-muted-foreground">{initials}</span>
      )}
    </div>
  );
}

// ─── Stat Card ───
interface StatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
}

export function Stat({ label, value, icon, trend, accent }: StatProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300 hover:bg-white/[0.05]",
        accent
          ? "border-white/[0.08] hover:border-terracotta-500/30 hover:shadow-[0_0_30px_-5px] hover:shadow-terracotta-500/15"
          : "border-white/[0.06] hover:border-white/[0.1]",
      )}
    >
      {accent && (
        <div className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-terracotta-500/60 to-transparent" />
      )}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/40 tracking-[0.15em] uppercase">{label}</span>
        {icon && <div className="text-white/20 transition-colors group-hover:text-white/40">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="text-4xl font-black tracking-tight text-white tabular-nums">
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              trend.positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400",
            )}
          >
            {trend.positive ? "\u2191" : "\u2193"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
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
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
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
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ─── Divider ───
export function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t border-border", className)} />;
}

// ─── Legacy Toggle (uses shadcn Switch inside) ───
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  const { Switch } = require("@/components/ui/switch");
  return (
    <div className={cn("flex items-center justify-between gap-4", disabled && "opacity-40")}>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <p className="text-sm font-medium text-foreground">{label}</p>}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

// ─── LoadingButton ───
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "default" | "primary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg";
}

export function LoadingButton({
  className,
  loading,
  variant = "default",
  size = "default",
  children,
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary:
      "rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80",
    default:
      "rounded-lg bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70",
    outline:
      "rounded-lg border border-input bg-background text-foreground hover:bg-muted/50 hover:text-foreground",
    ghost: "rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    destructive:
      "rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
  };
  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5",
    default: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-40",
        "select-none active:scale-[0.97]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

export { Loader2 };
