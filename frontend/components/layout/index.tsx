"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Link2, BarChart3, Layout, QrCode, Globe, Users,
  CreditCard, Settings, LogOut, User, Bell, CheckCheck, MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser, useNotifications, useMarkAllRead, useMarkRead } from "@/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useRef, useEffect } from "react";

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

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-xs font-bold text-white shadow-sm">
            L
          </div>
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            LinkNest
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.label}
                  render={<Link href={item.href} />}
                >
                  <Icon className={cn(active ? "text-terracotta-400" : "")} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" render={<Link href="/dashboard/settings" />}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useNotifications();
  const markAllRead = useMarkAllRead();
  const markRead = useMarkRead();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifs = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <Bell className="h-[17px] w-[17px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-terracotta-500 px-[3px] text-[10px] font-bold text-white ring-2 ring-[#0d0b0a]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-white/[0.08] bg-[#0d0b0a] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white/70">Notifications</h3>
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/[0.08] border-t-terracotta-500" />
              </div>
            ) : notifs.length === 0 ? (
              <div className="flex flex-col items-center py-10 px-4 text-center">
                <Bell className="h-8 w-8 text-white/[0.08] mb-3" />
                <p className="text-sm text-white/30">No notifications yet</p>
                <p className="text-xs text-white/20 mt-1">Notifications appear when someone clicks your links</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {notifs.map((n: any) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] ${
                      !n.read ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      !n.read
                        ? "bg-terracotta-500/10 text-terracotta-400"
                        : "bg-white/[0.06] text-white/30"
                    }`}>
                      <MousePointerClick className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${!n.read ? "text-white/80 font-medium" : "text-white/50"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => markRead.mutate(n.id)}
                            className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg text-white/20 hover:text-terracotta-400 hover:bg-white/[0.06] transition-all"
                            title="Mark read"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {n.message && (
                        <p className="text-xs text-white/30 mt-0.5 truncate">{n.message}</p>
                      )}
                      <p className="text-[11px] text-white/20 mt-1">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function UserAvatar({ name, email }: { name?: string | null; email?: string | null }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.slice(0, 2).toUpperCase() || "?";
  return (
    <Avatar size="sm">
      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
    </Avatar>
  );
}

export function AppHeader() {
  const { user, logout } = useCurrentUser();
  const pathname = usePathname();

  const handleSignOut = () => {
    logout();
    window.location.href = "/login";
  };

  const currentPage = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl px-4 lg:px-6">
        <SidebarTrigger className="-ml-1.5 size-8 text-white/40 hover:text-white" />

      {/* Page title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {currentPage && (
          <>
            <currentPage.icon className="h-4 w-4 text-terracotta-500 shrink-0 hidden sm:block" />
            <h1 className="text-sm font-medium text-white/70 truncate">
              {currentPage.label}
            </h1>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <NotificationBell />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="sm" className="gap-2 px-1.5 text-white/40 hover:text-white" />
          }>
            <UserAvatar name={user?.full_name} email={user?.email} />
            {user?.full_name && (
              <span className="hidden sm:inline max-w-[100px] truncate text-sm font-medium">
                {user.full_name}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-white/[0.08] bg-[#0d0b0a] backdrop-blur-2xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white/80">{user?.full_name || "User"}</span>
                  <span className="text-xs font-normal text-white/40 truncate">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = "/dashboard/settings"}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
