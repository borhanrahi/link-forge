"use client";

import { create } from "zustand";
import { api } from "./api-client";
import { authClient } from "./auth-client";
import type { User } from "@/types/generated";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingApp: boolean;
  activeWorkspaceId: string | null;

  setUser: (user: User) => void;
  setActiveWorkspace: (id: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  fetchUser: (fallbackEmail?: string, fallbackName?: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isLoadingApp: true,
  activeWorkspaceId: null,

  setUser: (user: User) => {
    const workspaceId = user.default_workspace_id || null;
    if (workspaceId && typeof window !== 'undefined') {
      localStorage.setItem('active_workspace_id', workspaceId);
    }
    set({ user, activeWorkspaceId: workspaceId });
  },

  setActiveWorkspace: (id: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('active_workspace_id', id);
    }
    set({ activeWorkspaceId: id });
  },

  login: async (email: string, password: string) => {
    // Use Neon Auth to sign in
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw new Error(result.error.message || "Login failed");
    }
    // Fetch user data from our backend (pass email as fallback for neon-callback sync)
    await get().fetchUser(email);
    // Verify the backend sync actually worked
    if (!get().isAuthenticated) {
      throw new Error("Account found but failed to sync with backend. Please try again.");
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    // Use Neon Auth to sign up
    const result = await authClient.signUp.email({
      email,
      password,
      name: fullName,
    });
    if (result.error) {
      throw new Error(result.error.message || "Registration failed");
    }
    // Fetch user data from our backend (pass email and name as fallback)
    await get().fetchUser(email, fullName);
    // Verify the backend sync actually worked
    if (!get().isAuthenticated) {
      throw new Error("Account created but failed to sync with backend. Please try logging in.");
    }
  },

  logout: async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore signOut errors
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('active_workspace_id');
    }
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isLoadingApp: false,
      activeWorkspaceId: null,
    });
  },

  fetchUser: async (fallbackEmail?: string, fallbackName?: string) => {
    try {
      const user = await api.get<User>("/me");
      const workspaceId = user.default_workspace_id || null;
      if (workspaceId && typeof window !== 'undefined') {
        localStorage.setItem('active_workspace_id', workspaceId);
      }
      set({
        user,
        activeWorkspaceId: workspaceId,
        isAuthenticated: true,
        isLoading: false,
        isLoadingApp: false,
      });
    } catch {
      // If fetching user fails, check if we have a valid Neon Auth session
      const session = await authClient.getSession();
      if (session?.data?.user) {
        // Session exists but our backend doesn't know this user yet — try to register them
        try {
          const neonUser = session.data.user;
          const user = await api.post<User>("/auth/neon-callback", {
            email: neonUser.email,
            name: (neonUser as any).name || neonUser.email?.split("@")[0] || "User",
          });
          const wsId = user.default_workspace_id || null;
          if (wsId && typeof window !== 'undefined') {
            localStorage.setItem('active_workspace_id', wsId);
          }
          set({
            user,
            activeWorkspaceId: wsId,
            isAuthenticated: true,
            isLoading: false,
            isLoadingApp: false,
          });
          return;
        } catch (err: any) {
          console.error("[Auth] neon-callback failed:", err?.message || err);
        }
      }

      // If we have a fallback email (e.g. from login form), sync directly
      if (fallbackEmail) {
        try {
          const user = await api.post<User>("/auth/neon-callback", {
            email: fallbackEmail,
            name: fallbackName || fallbackEmail.split("@")[0] || "User",
          });
          const fbWsId = user.default_workspace_id || null;
          if (fbWsId && typeof window !== 'undefined') {
            localStorage.setItem('active_workspace_id', fbWsId);
          }
          set({
            user,
            activeWorkspaceId: fbWsId,
            isAuthenticated: true,
            isLoading: false,
            isLoadingApp: false,
          });
          return;
        } catch (err: any) {
          console.error("[Auth] neon-callback fallback failed:", err?.message || err);
        }
      }

      console.error("[Auth] fetchUser failed - no session available");
      // Not authenticated
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isLoadingApp: false,
        activeWorkspaceId: null,
      });
    }
  },

  initialize: async () => {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        await get().fetchUser(session.data.user.email, (session.data.user as any).name);
        return;
      }

      // getSession() returned null — try stored session data directly
      const storedUser = authClient.getStoredUser();
      if (storedUser) {
        await get().fetchUser(storedUser.email, storedUser.name);
      } else {
        set({ isLoading: false, isLoadingApp: false });
      }
    } catch {
      set({ isLoading: false, isLoadingApp: false });
    }
  },
}));

// Initialize auth state on load
if (typeof window !== "undefined") {
  useAuthStore.getState().initialize();
}
