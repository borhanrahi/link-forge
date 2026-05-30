"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Link2, BarChart3, Layout, QrCode, Globe, Users, CreditCard,
  Settings, Plus, LayoutDashboard, Search,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "G D" },
  { href: "/dashboard/links", label: "Links", icon: Link2, shortcut: "G L" },
  { href: "/dashboard/links/new", label: "New Link", icon: Plus, shortcut: "Ctrl+N" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, shortcut: "G A" },
  { href: "/dashboard/bio-pages", label: "Bio Pages", icon: Layout, shortcut: "G B" },
  { href: "/dashboard/qr-codes", label: "QR Codes", icon: QrCode, shortcut: "G Q" },
  { href: "/dashboard/domains", label: "Domains", icon: Globe },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette" description="Navigate, search, and perform actions...">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => runCommand(item.href)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="create-link" onSelect={() => runCommand("/dashboard/links/new")}>
            <Plus className="h-4 w-4" />
            <span>Create new link</span>
            <CommandShortcut>Ctrl+N</CommandShortcut>
          </CommandItem>
          <CommandItem value="create-bio" onSelect={() => runCommand("/dashboard/bio-pages/new")}>
            <Layout className="h-4 w-4" />
            <span>Create bio page</span>
            <CommandShortcut>Ctrl+B</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
