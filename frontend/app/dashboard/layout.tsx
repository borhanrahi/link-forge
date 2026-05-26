"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar, Header } from "@/components/layout";
import { Toaster } from "sonner";
import { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";

const SidebarContext = createContext({
  collapsed: false,
  setCollapsed: (_: boolean) => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoadingApp } = useAuthStore();
  const [queryClient] = useState(() => new QueryClient());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoadingApp) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoadingApp, router]);

  // Show loading while checking auth
  if (isLoadingApp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold text-neutral-950">L</div>
          <p className="text-sm text-neutral-400">Loading...</p>
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
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <div className="flex min-h-screen bg-neutral-950">
          <Sidebar />
          <div className={cn("flex-1 transition-all duration-200", collapsed ? "md:pl-[68px]" : "md:pl-60")}>
            <Header />
            <main className="p-6 lg:p-8">{children}</main>
          </div>
        </div>
        <Toaster />
      </SidebarContext.Provider>
    </QueryClientProvider>
  );
}
