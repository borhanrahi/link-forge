"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Input, Button, Toggle, Divider, SectionHeading } from "@/components/ui";
import { useCurrentUser } from "@/hooks";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <SectionHeading
        title="Settings"
        description="Manage your account settings"
      />

      {/* Profile */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Profile</h3>
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
          <div className="pt-2">
            <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Security</h3>
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
          <div className="pt-2">
            <Button size="sm" onClick={handleUpdatePassword} disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}>
              {savingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Preferences</h3>
          <Toggle label="Email notifications for new clicks" checked onChange={() => {}} />
          <Divider />
          <Toggle label="Weekly analytics digest" checked onChange={() => {}} />
          <Divider />
          <Toggle label="Public profile page" checked={false} onChange={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
}
