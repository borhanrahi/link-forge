"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar, AppHeader } from "@/components/layout";
import { CommandPalette } from "@/components/command-palette";
import { Toaster } from "sonner";
import { useState, useCallback } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useKeyboardShortcut({
    key: "n",
    modifiers: ["ctrl"],
    handler: useCallback(() => {
      router.push("/dashboard/links/new");
    }, [router]),
  });

  useKeyboardShortcut({
    key: "b",
    modifiers: ["ctrl"],
    handler: useCallback(() => {
      router.push("/dashboard/bio-pages/new");
    }, [router]),
  });

  const { isAuthenticated, isLoadingApp } = useAuthStore();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (!isAuthenticated && !isLoadingApp) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoadingApp, router]);

  // Show loading while checking auth
  if (isLoadingApp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta-500 text-sm font-bold text-white shadow-sm">
            L
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-svh w-full bg-background">
          <AppSidebar />
          <SidebarInset className="peer-data-[variant=inset]:m-0 peer-data-[variant=inset]:rounded-none peer-data-[variant=inset]:shadow-none">
            <AppHeader />
            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </SidebarInset>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "border-border bg-card text-card-foreground shadow-sm",
          }}
        />
      </SidebarProvider>
      <CommandPalette />
    </QueryClientProvider>
  );
}
