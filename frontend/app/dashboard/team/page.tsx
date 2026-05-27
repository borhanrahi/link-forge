"use client";

import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useWorkspaces, useMembers, useCurrentUser } from "@/hooks";
import { Users, Mail, Loader2, Building2, UserPlus, Sparkles } from "lucide-react";

export default function TeamPage() {
  const { user } = useCurrentUser();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const activeWorkspaceId = workspaces?.[0]?.id;
  const { data: members, isLoading: membersLoading } = useMembers(activeWorkspaceId);

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
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-white/70">Workspace Members</h3>
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
                    {(m.user?.full_name || m.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">
                      {m.user?.full_name || m.email || "Unknown"}
                    </p>
                    <p className="text-xs text-white/30 capitalize">{m.role || "member"}</p>
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

      {/* Invite */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-transparent backdrop-blur-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-white/80">Invite team members</p>
              <p className="text-sm text-white/40">Send an invitation to join your workspace</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500">
            <Mail className="h-4 w-4 mr-1.5" />
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
