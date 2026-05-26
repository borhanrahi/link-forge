"use client";

import { Button, Card, CardContent, Badge, SectionHeading } from "@/components/ui";
import { useWorkspaces, useMembers, useCurrentUser } from "@/hooks";
import { Users, Mail, Loader2, Building2 } from "lucide-react";

export default function TeamPage() {
  const { user } = useCurrentUser();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const activeWorkspaceId = workspaces?.[0]?.id;
  const { data: members, isLoading: membersLoading } = useMembers(activeWorkspaceId);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Team"
        description="Manage workspaces and team members"
      />

      {workspacesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(workspaces || []).length > 0 ? (
            (workspaces as any[]).map((ws: any) => (
              <Card key={ws.id}>
                <CardContent className="p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-900 dark:text-neutral-100">{ws.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
                    <span>{ws.member_count ?? members?.length ?? 0} members</span>
                    {ws.plan && (
                      <>
                        <span>&middot;</span>
                        <Badge variant="default">{ws.plan}</Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-5 text-center py-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 mx-auto dark:bg-neutral-800">
                  <Building2 className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm text-neutral-400">No workspaces yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Members section */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Workspace Members
          </h3>
          {membersLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          ) : members && members.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {(members as any[]).map((m: any, i: number) => (
                <div key={m.id || i} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {(m.user?.full_name || m.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {m.user?.full_name || m.email || "Unknown"}
                      </p>
                      <p className="text-xs text-neutral-400">{m.role || "member"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-6">
              {workspaces ? "No members found for this workspace." : "Create a workspace to add members."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Invite section */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">Invite team members</p>
              <p className="text-sm text-neutral-400">Send an invitation to join your workspace</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Invite</Button>
        </CardContent>
      </Card>
    </div>
  );
}
