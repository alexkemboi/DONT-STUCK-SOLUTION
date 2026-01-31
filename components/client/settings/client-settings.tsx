"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Bell, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/authclient";

interface ClientSettingsProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function ClientSettings({ user }: ClientSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loanUpdates, setLoanUpdates] = useState(true);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Account Information
              </CardTitle>
              <p className="text-sm text-slate-500">Your account details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-slate-500">Full Name</Label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {user?.name || "—"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Email Address</Label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {user?.email || "—"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Role</Label>
              <div className="mt-1">
                <Badge className="bg-emerald-100 text-emerald-800">
                  {user?.role || "—"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Notification Preferences
              </CardTitle>
              <p className="text-sm text-slate-500">
                Choose what notifications you receive
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Email Notifications
              </p>
              <p className="text-xs text-slate-500">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Loan Status Updates
              </p>
              <p className="text-xs text-slate-500">
                Get notified when your loan status changes
              </p>
            </div>
            <Switch
              checked={loanUpdates}
              onCheckedChange={setLoanUpdates}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Change Password
              </CardTitle>
              <p className="text-sm text-slate-500">
                Update your account password
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-sm text-slate-700">
                Current Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-sm text-slate-700">
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm text-slate-700">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
