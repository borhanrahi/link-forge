"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

// ─── Re-export all proper shadcn components ───
export { Button } from "@/components/ui/button";
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
export { Badge } from "@/components/ui/badge";
export { Stat } from "@/components/ui/stat";
export { EmptyState } from "@/components/ui/empty-state";
export { AreaChart, BarChart, LineChart, PieChart, ChartContainer, CHART_COLORS } from "@/components/ui/chart";
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
        <label className="text-sm font-medium text-foreground/80">{label}</label>
      )}
      <ShadcnInput
        className={cn(
          "h-10 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-terracotta-500/50 focus-visible:ring-terracotta-500/20",
          error && "border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
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
        <label className="text-sm font-medium text-foreground/80">{label}</label>
      )}
      <ShadcnTextarea
        className={cn(
          "border-border bg-background text-foreground placeholder:text-muted-foreground/50",
          error && "border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
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

// ─── Stat Card (re-exported from ./stat at top of file) ───

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

// ─── EmptyState (re-exported from ./empty-state at top of file) ───

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
