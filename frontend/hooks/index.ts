"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

import type { User, Workspace, Link, BioPage, CustomDomain, BioBlock, Invoice, Subscription, QRCodeWithLink } from "@/types/generated";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    staleTime: 30000,
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

// ─── Sparklines ───

export function useSparklines() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", "sparklines"],
    queryFn: () => api.get<Record<string, number[]>>("/analytics/sparklines"),
    enabled: isAuthenticated,
    staleTime: 60000,
  });
}

// ─── Notifications ───

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<{ notifications: any[]; unread_count: number }>("/notifications"),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
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

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, email, role }: { workspaceId: string; email: string; role?: string }) =>
      api.post(`/workspaces/${workspaceId}/invite`, { email, role: role || "member" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

// ─── Tags ───

export function useTags() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get<any[]>("/tags"),
    enabled: isAuthenticated,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; color?: string }) =>
      api.post<any>("/tags", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useSetLinkTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, tagIds }: { linkId: string; tagIds: string[] }) =>
      api.post(`/tags/link/${linkId}`, { tag_ids: tagIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

// ─── API Keys ───

export function useAPIKeys() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: () => api.get<any[]>("/api-keys"),
    enabled: isAuthenticated,
  });
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; scopes?: string }) =>
      api.post<any>("/api-keys", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}

export function useRevokeAPIKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api-keys/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}

// ─── Click Goal Alerts ───

export function useClickGoalAlerts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["click-goal-alerts"],
    queryFn: () => api.get<any[]>("/alerts"),
    enabled: isAuthenticated,
  });
}

export function useCreateClickGoalAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { link_id: string; goal_clicks: number }) =>
      api.post<any>("/alerts", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["click-goal-alerts"] }),
  });
}

export function useDeleteClickGoalAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/alerts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["click-goal-alerts"] }),
  });
}

// ─── A/B Tests ───

export function useABTests() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["ab-tests"],
    queryFn: () => api.get<any[]>("/ab-tests"),
    enabled: isAuthenticated,
  });
}

export function useCreateABTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; variants: { name: string; url: string; weight: number }[] }) =>
      api.post<any>("/ab-tests", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ab-tests"] }),
  });
}

export function useToggleABTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/ab-tests/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ab-tests"] }),
  });
}

export function useDeleteABTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/ab-tests/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ab-tests"] }),
  });
}

// ─── Link Analytics ───

export function useLinkTimeseries(linkId: string, range: string = "30d") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", linkId, "timeseries", range],
    queryFn: () => api.get<any[]>(`/analytics/${linkId}/timeseries?range=${range}`),
    enabled: isAuthenticated && !!linkId,
  });
}

export function useLinkGeo(linkId: string, range: string = "30d") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", linkId, "geo", range],
    queryFn: () => api.get<any[]>(`/analytics/${linkId}/geo?range=${range}`),
    enabled: isAuthenticated && !!linkId,
  });
}

export function useLinkDevices(linkId: string, range: string = "30d") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", linkId, "devices", range],
    queryFn: () => api.get<any[]>(`/analytics/${linkId}/devices?range=${range}`),
    enabled: isAuthenticated && !!linkId,
  });
}

export function useLinkReferrers(linkId: string, range: string = "30d") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["analytics", linkId, "referrers", range],
    queryFn: () => api.get<any[]>(`/analytics/${linkId}/referrers?range=${range}`),
    enabled: isAuthenticated && !!linkId,
  });
}

// ─── Bulk Operations ───

export function useBulkLinkAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { link_ids: string[]; action: string }) =>
      api.post<any>("/links/bulk/action", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useReorderLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkIds: string[]) =>
      api.post<any>("/links/reorder", { link_ids: linkIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

// ─── Export/Import ───

export function useExportWorkspace() {
  return useMutation({
    mutationFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('neon_session_token') : null;
      const workspaceId = typeof window !== 'undefined' ? localStorage.getItem('active_workspace_id') : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (workspaceId) headers["X-Workspace-Id"] = workspaceId;
      
      const res = await fetch(`${API_BASE}/workspace/export`, { headers });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "linknest-export.json";
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

// ─── Billing Checkout ───

export function useCheckout() {
  return useMutation({
    mutationFn: async (data: { price_id: string }) => {
      const res = await api.post<{ url: string }>("/billing/checkout", {
        price_id: data.price_id,
        success_url: typeof window !== "undefined" ? `${window.location.origin}/dashboard/billing?success=true` : "",
        cancel_url: typeof window !== "undefined" ? `${window.location.origin}/dashboard/billing?canceled=true` : "",
      });
      if (res.url && typeof window !== "undefined") {
        window.location.href = res.url;
      }
      return res;
    },
  });
}
