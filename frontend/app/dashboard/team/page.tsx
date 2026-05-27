"use client";

import { Badge } from "@/components/ui";
import { useWorkspaces, useMembers, useCurrentUser } from "@/hooks";
import { Users, Mail, Loader2, Building2, UserPlus } from "lucide-react";

export default function TeamPage() {
  const { user } = useCurrentUser();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const activeWorkspaceId = workspaces?.[0]?.id;
  const { data: members, isLoading: membersLoading } = useMembers(activeWorkspaceId);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Team</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage workspaces and team members</p>
      </div>

      {/* Workspaces grid */}
      {workspacesLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(workspaces || []).length > 0 ? (
            (workspaces as any[]).map((ws: any) => (
              <div key={ws.id} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm transition-all hover:border-neutral-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{ws.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
                  <span>{ws.member_count ?? members?.length ?? 0} members</span>
                  {ws.plan && (
                    <>
                      <span className="text-neutral-700">&middot;</span>
                      <Badge variant="default">{ws.plan}</Badge>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-500 mx-auto">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm text-neutral-400">No workspaces yet</p>
            </div>
          )}
        </div>
      )}

      {/* Members section */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50">
        <div className="px-6 py-4 border-b border-neutral-800">
          <h3 className="font-semibold text-white">Workspace Members</h3>
        </div>
        {membersLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
          </div>
        ) : members && members.length > 0 ? (
          <div className="divide-y divide-neutral-800">
            {(members as any[]).map((m: any, i: number) => (
              <div key={m.id || i} className="flex items-center justify-between px-6 py-3.5 hover:bg-neutral-800/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-xs font-semibold text-white">
                    {(m.user?.full_name || m.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      {m.user?.full_name || m.email || "Unknown"}
                    </p>
                    <p className="text-xs text-neutral-500">{m.role || "member"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-neutral-500">
              {workspaces ? "No members found for this workspace." : "Create a workspace to add members."}
            </p>
          </div>
        )}
      </div>

      {/* Invite section */}
      <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-950 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-white">Invite team members</p>
              <p className="text-sm text-neutral-400">Send an invitation to join your workspace</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500">
            <Mail className="h-4 w-4" />
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}
