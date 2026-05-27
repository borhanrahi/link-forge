"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useWorkspaces, useMembers, useCurrentUser, useInviteMember } from "@/hooks";
import { Users, Mail, Loader2, Building2, UserPlus, Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function TeamPage() {
  const { user } = useCurrentUser();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const activeWorkspaceId = workspaces?.[0]?.id;
  const { data: members, isLoading: membersLoading, refetch: refetchMembers } = useMembers(activeWorkspaceId);
  const inviteMember = useInviteMember();

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !activeWorkspaceId) return;
    try {
      await inviteMember.mutateAsync({ workspaceId: activeWorkspaceId, email: inviteEmail.trim() });
      toast.success("Invitation sent!");
      setInviteEmail("");
      setShowInvite(false);
    } catch (err: any) {
      try {
        const body = JSON.parse(err.message);
        toast.error(body.detail || "Failed to invite member");
      } catch {
        toast.error(err.message || "Failed to invite member");
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
            <Sparkles className="h-3 w-3" />
            Collaboration
          </span>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="mt-2 text-sm text-white/40 font-light">Manage workspaces and team members</p>
        </div>
      </div>

      {/* Workspaces */}
      {workspacesLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-white/20" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(workspaces || []).length > 0 ? (
            (workspaces as any[]).map((ws: any) => (
              <div key={ws.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 transition-all hover:border-terracotta-500/30 hover:shadow-[0_0_40px_-8px] hover:shadow-terracotta-500/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06]">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white/80">{ws.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/40">
                  <span>{ws.member_count ?? members?.length ?? 0} members</span>
                  {ws.plan && (
                    <>
                      <span className="text-white/[0.08]">&middot;</span>
                      <span className="inline-flex items-center rounded-full border border-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/40 bg-white/[0.03]">
                        {ws.plan}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
              <EmptyState
                icon={<Building2 className="h-5 w-5 text-white/30" />}
                title="No workspaces yet"
              />
            </div>
          )}
        </div>
      )}

      {/* Members */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-white/70">Workspace Members</h3>
          <Button
            size="sm"
            onClick={() => setShowInvite(true)}
            className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1" />
            Invite
          </Button>
        </div>
        {membersLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-white/20" />
          </div>
        ) : members && members.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {(members as any[]).map((m: any, i: number) => (
              <div key={m.id || i} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-sm font-semibold text-white">
                    {(m.full_name || m.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">
                      {m.full_name || m.email || "Unknown"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-white/30 capitalize">{m.role || "member"}</p>
                      {m.invite_status && m.invite_status !== "active" && (
                        <span className="text-[11px] text-amber-400/60">{m.invite_status}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10">
            <EmptyState
              icon={<Users className="h-5 w-5 text-white/30" />}
              title={workspaces ? "No members found" : "Create a workspace to add members"}
            />
          </div>
        )}
      </div>

      {/* Invite dialog overlay */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0b0a] backdrop-blur-2xl shadow-2xl shadow-black/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <UserPlus className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-white/80">Invite member</h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl px-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  autoFocus
                />
                <p className="mt-1.5 text-xs text-white/30">
                  They must have a LinkNest account with this email.
                </p>
              </div>

              {inviteMember.isError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <p className="text-sm text-red-300">
                    {(() => {
                      try { return JSON.parse(inviteMember.error.message).detail || "Failed to invite"; }
                      catch { return inviteMember.error.message || "Failed to invite"; }
                    })()}
                  </p>
                </div>
              )}

              {inviteMember.isSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-300">Invitation sent!</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => { setShowInvite(false); setInviteEmail(""); }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || inviteMember.isPending}
                className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
              >
                {inviteMember.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-1.5" />Sending...</>
                ) : (
                  <><Mail className="h-4 w-4 mr-1.5" />Send Invite</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
