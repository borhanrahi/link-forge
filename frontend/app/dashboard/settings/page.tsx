"use client";

import { useState, useEffect } from "react";
import { Input, Toggle } from "@/components/ui";
import { useCurrentUser } from "@/hooks";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, User, Shield, SlidersHorizontal } from "lucide-react";

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.patch("/me", { full_name: fullName });
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await api.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage your account settings</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
            <User className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-white">Profile</h3>
        </div>
        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
          hint="Email cannot be changed yet"
        />
        <div className="pt-1">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Shield className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-white">Security</h3>
        </div>
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
        <div className="pt-1">
          <button
            onClick={handleUpdatePassword}
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-white">Preferences</h3>
        </div>
        <Toggle label="Email notifications for new clicks" checked onChange={() => {}} />
        <div className="border-t border-neutral-800" />
        <Toggle label="Weekly analytics digest" checked onChange={() => {}} />
        <div className="border-t border-neutral-800" />
        <Toggle label="Public profile page" checked={false} onChange={() => {}} />
      </div>
    </div>
  );
}
