"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Link2, BarChart3, Layout, QrCode, Globe, Users,
  CreditCard, Settings, ChevronLeft, PanelLeft, LogOut, User, Bell,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, DropdownMenu } from "@/components/ui";
import { useCurrentUser } from "@/hooks";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/bio-pages", label: "Bio Pages", icon: Layout },
  { href: "/dashboard/qr-codes", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/domains", label: "Domains", icon: Globe },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-neutral-800/70 bg-neutral-950/90 backdrop-blur-sm transition-all duration-200",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-neutral-800/50",
          collapsed ? "justify-center px-0" : "px-4",
        )}
      >
        <Link href="/dashboard" className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-xs font-bold text-white shadow-sm">
            L
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-white">
              LinkNest
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-terracotta-500/10 text-terracotta-300 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-r-full before:bg-terracotta-500"
                  : "text-neutral-400 hover:bg-neutral-800/40 hover:text-white",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active ? "text-terracotta-400" : "text-neutral-500",
                )}
              />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span className="invisible absolute left-full ml-3 rounded-md bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-200 opacity-0 shadow-sm transition-all group-hover:visible group-hover:opacity-100 whitespace-nowrap z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center border-t border-neutral-800/50 p-3.5 text-neutral-600 transition-colors hover:text-neutral-400"
      >
        <ChevronLeft
          className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")}
        />
      </button>
    </aside>
  );
}

export function Header() {
  const { user, logout } = useCurrentUser();

  const handleSignOut = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-neutral-800/50 bg-neutral-950/60 backdrop-blur-xl px-6">
      {/* Mobile menu trigger */}
      <div className="md:hidden">
        <MobileMenu />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-0.5">
        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-all hover:bg-neutral-800/60 hover:text-neutral-300"
        >
          <Bell className="h-[17px] w-[17px]" />
          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-terracotta-500 ring-2 ring-neutral-950" />
        </button>

        {/* User menu */}
        <DropdownMenu
          trigger={
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg p-1.5 transition-all hover:bg-neutral-800/60"
            >
              <Avatar src={null} name={user?.full_name || "User"} size="sm" />
              {user?.full_name && (
                <span className="hidden sm:block text-sm font-medium text-neutral-400 max-w-[120px] truncate">
                  {user.full_name}
                </span>
              )}
            </button>
          }
          items={[
            { label: "Profile", icon: <User className="h-[14px] w-[14px]" /> },
            {
              label: "Settings",
              icon: <Settings className="h-[14px] w-[14px]" />,
              onClick: () => window.location.href = "/dashboard/settings",
            },
            { separator: true, label: "", onClick: () => {} },
            {
              label: "Sign out",
              icon: <LogOut className="h-[14px] w-[14px]" />,
              danger: true,
              onClick: handleSignOut,
            },
          ]}
        />
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-all hover:bg-neutral-800/60 hover:text-neutral-300"
      >
        <PanelLeft className="h-[17px] w-[17px]" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm" onClick={close} />
          <aside className="relative z-10 flex h-full w-64 flex-col border-r border-neutral-800/50 bg-neutral-950/95 backdrop-blur-sm">
            <div className="flex h-14 items-center border-b border-neutral-800/50 px-4">
              <Link href="/" className="flex items-center gap-2.5" onClick={close}>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-xs font-bold text-white shadow-sm">
                  L
                </div>
                <span className="text-sm font-semibold text-white">LinkNest</span>
              </Link>
            </div>
            <nav className="flex-1 space-y-0.5 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-terracotta-500/10 text-terracotta-300"
                      : "text-neutral-400 hover:bg-neutral-800/40 hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        active ? "text-terracotta-400" : "text-neutral-500",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
