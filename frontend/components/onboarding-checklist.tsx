"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Link2, Layout, QrCode, Users, X } from "lucide-react";
import { useLinks, useBioPages } from "@/hooks";
import { useAuthStore } from "@/lib/auth-store";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  completed: boolean;
}

export function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(false);
  const { data: links } = useLinks();
  const { data: bioPages } = useBioPages();
  const { user } = useAuthStore();

  useEffect(() => {
    const d = localStorage.getItem("onboarding_dismissed");
    if (d) setDismissed(true);
  }, []);

  if (dismissed || (user?.onboarding_completed)) return null;

  const items: ChecklistItem[] = [
    {
      id: "create-link",
      label: "Create your first link",
      description: "Shorten a URL and start tracking clicks",
      href: "/dashboard/links/new",
      icon: Link2,
      completed: (links?.length ?? 0) > 0,
    },
    {
      id: "create-bio",
      label: "Set up a bio page",
      description: "Create a link-in-bio page for your profile",
      href: "/dashboard/bio-pages/new",
      icon: Layout,
      completed: (bioPages?.length ?? 0) > 0,
    },
    {
      id: "generate-qr",
      label: "Generate a QR code",
      description: "Create a QR code for easy sharing",
      href: "/dashboard/qr-codes",
      icon: QrCode,
      completed: false,
    },
    {
      id: "invite-team",
      label: "Invite a team member",
      description: "Collaborate with your team",
      href: "/dashboard/team",
      icon: Users,
      completed: false,
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const allDone = completedCount === items.length;

  if (allDone) {
    localStorage.setItem("onboarding_dismissed", "true");
    return null;
  }

  return (
    <div className="dash-glass rounded-2xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground/80">Getting Started</h3>
          <p className="text-xs text-muted-foreground/70 mt-0.5">{completedCount}/{items.length} completed</p>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem("onboarding_dismissed", "true");
          }}
          className="text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted mb-5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-400 transition-all duration-500"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl p-3 transition-all group ${
                item.completed
                  ? "opacity-50"
                  : "hover:bg-[var(--dash-glass-hover-bg)]"
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-forest-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0 group-hover:text-terracotta-500 transition-colors" />
              )}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground/60 shrink-0 group-hover:text-terracotta-500 transition-colors">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${item.completed ? "text-muted-foreground/60" : "text-foreground/70 group-hover:text-foreground/90"} transition-colors`}>
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground/60">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
