"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

import type { User, Workspace, Link, BioPage, CustomDomain, BioBlock, Invoice, Subscription, QRCodeWithLink } from "@/types/generated";

// ─── Auth ───

export function useCurrentUser() {
  return useAuthStore();
}

// ─── Links ───

export function useLinks() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["links"],
    queryFn: () => api.get<Link[]>("/links"),
    enabled: isAuthenticated,
  });
}

export function useLink(id: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["links", id],
    queryFn: () => api.get<Link>(`/links/${id}`),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { original_url: string; title?: string; custom_alias?: string; password?: string }) =>
      api.post<Link>("/links", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; original_url?: string; title?: string; is_active?: boolean }) =>
      api.patch<Link>(`/links/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

// ─── Workspaces ───

export function useWorkspaces() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => api.get<Workspace[]>("/workspaces"),
    enabled: isAuthenticated,
  });
}

// ─── Bio Pages ───

export function useBioPages() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["bio-pages"],
    queryFn: () => api.get<BioPage[]>("/bio-pages"),
    enabled: isAuthenticated,
  });
}

export function useBioPage(id: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["bio-pages", id],
    queryFn: () => api.get<BioPage>(`/bio-pages/${id}`),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateBioPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; slug: string; theme?: string; brand_color?: string; bg_color?: string; font_family?: string }) =>
      api.post<BioPage>("/bio-pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post<{ is_published: boolean }>(`/bio-pages/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

export function useDeleteBioPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/bio-pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

export function useUpdateBioPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.patch<BioPage>(`/bio-pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

export function useAddBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, data }: { pageId: string; data: any }) =>
      api.post<BioBlock>(`/bio-pages/${pageId}/blocks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, blockId, data }: { pageId: string; blockId: string; data: any }) =>
      api.patch<BioBlock>(`/bio-pages/${pageId}/blocks/${blockId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, blockId }: { pageId: string; blockId: string }) =>
      api.delete(`/bio-pages/${pageId}/blocks/${blockId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-pages"] });
    },
  });
}

// ─── Domains ───

export function useDomains() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["domains"],
    queryFn: () => api.get<CustomDomain[]>("/domains"),
    enabled: isAuthenticated,
  });
}

export function useAddDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domain: string) => api.post<CustomDomain>("/domains", { domain }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

// ─── Analytics ───

export function useAnalytics(range: string = "30d") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", "dashboard", range],
    queryFn: () => api.get<any>(`/analytics/dashboard?range=${range}`),
    enabled: isAuthenticated,
  });
}

export function useLinkAnalytics(linkId: string, range: string = "30d") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", linkId, range],
    queryFn: () => api.get<any>(`/analytics/${linkId}?range=${range}`),
    enabled: isAuthenticated && !!linkId,
  });
}

// ─── QR Codes ───

export function useQRCodes() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["qr-codes"],
    queryFn: () => api.get<QRCodeWithLink[]>("/qr"),
    enabled: isAuthenticated,
  });
}

export function useCreateQRCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { link_id: string; color_fg?: string; color_bg?: string }) =>
      api.post("/qr", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
    },
  });
}

export function useDeleteQRCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/qr/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
    },
  });
}

export function useRegenerateQR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, color_fg, color_bg }: { linkId: string; color_fg?: string; color_bg?: string }) =>
      api.post(`/qr/${linkId}/regenerate`, { color_fg: color_fg || "#000000", color_bg: color_bg || "#ffffff" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
    },
  });
}

// ─── Billing ───

export function useSubscription() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => api.get<Subscription>("/subscriptions/current"),
    enabled: isAuthenticated,
  });
}

export function usePlans() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get<{ plans: any[]; current_plan: string; subscription: any }>("/billing/plans"),
    enabled: isAuthenticated,
  });
}

export function useInvoices() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => api.get<Invoice[]>("/billing/invoices"),
    enabled: isAuthenticated,
  });
}

// ─── UTM Presets ───

export function useUTMPresets() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["utm-presets"],
    queryFn: () => api.get<any[]>("/utm/presets"),
    enabled: isAuthenticated,
  });
}

// ─── Members ───

export function useMembers(workspaceId?: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => api.get<any[]>(`/workspaces/${workspaceId}/members`),
    enabled: isAuthenticated && !!workspaceId,
  });
}
