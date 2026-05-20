"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { User, Mail, LogOut, Camera, Shield, Settings, Lock, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    phone?: string | null;
    address?: string | null;
    twoFactorEnabled?: boolean;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState({
    id: user.id || "",
    name: user.name || "",
    email: user.email || "",
    image: user.image || "",
    phone: user.phone || "",
    address: user.address || "",
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted || !data) return;
        setProfile({
          id: data.id || user.id || "",
          name: data.name || "",
          email: data.email || "",
          image: data.image || "",
          phone: data.phone || "",
          address: data.address || "",
          twoFactorEnabled: Boolean(data.twoFactorEnabled),
        });
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, [user.id, user.name, user.email, user.image, user.phone, user.address, user.twoFactorEnabled]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
          phone: profile.phone,
          address: profile.address,
          twoFactorEnabled: profile.twoFactorEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");
      setProfile((prev) => ({ ...prev, ...data }));
      toast.success("Profile saved successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to change password");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const toggle2FA = async () => {
    setSaving(true);
    try {
      const nextValue = !profile.twoFactorEnabled;
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFactorEnabled: nextValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update 2FA");
      setProfile((prev) => ({ ...prev, twoFactorEnabled: Boolean(data?.twoFactorEnabled) }));
      toast.success(nextValue ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update 2FA");
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden transition-colors duration-300">
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-lg">
              {profile.image ? (
                <Image src={profile.image} alt={profile.name || "User"} width={128} height={128} className="object-cover" />
              ) : (
                <User className="w-full h-full p-6 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </button>
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-bold text-white mb-1">{profile.name || "Foodie"}</h1>
            <p className="text-purple-100 flex items-center gap-2">
              <Mail size={14} /> {profile.email}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">
        {/* Navigation Tabs */}
        <div className="flex border-b dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 font-semibold transition-colors ${activeTab === "info" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-3 font-semibold transition-colors ${activeTab === "security" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent font-medium text-gray-900 dark:text-gray-100 outline-none border-b border-transparent focus:border-purple-500 pb-1"
                  placeholder="Enter your name"
                />
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 break-all">{profile.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <input
                  value={profile.phone || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-transparent font-medium text-gray-900 dark:text-gray-100 outline-none border-b border-transparent focus:border-purple-500 pb-1"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <input
                  value={profile.address || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-transparent font-medium text-gray-900 dark:text-gray-100 outline-none border-b border-transparent focus:border-purple-500 pb-1"
                  placeholder="Enter address"
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <Shield className="text-green-500" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggle2FA}
                  className={`btn btn-sm ${profile.twoFactorEnabled ? "btn-success" : "btn-outline"}`}
                  disabled={saving}
                >
                  {profile.twoFactorEnabled ? "Enabled" : "Enable"}
                </button>
              </div>

              <div className="p-4 rounded-xl border dark:border-gray-700 space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="text-purple-500" />
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Current password"
                    className="w-full rounded-lg border px-3 py-2 bg-transparent dark:border-gray-700"
                  />
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="New password"
                    className="w-full rounded-lg border px-3 py-2 bg-transparent dark:border-gray-700"
                  />
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border px-3 py-2 bg-transparent dark:border-gray-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={changePassword}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                  <CheckCircle2 size={18} /> Change Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition shadow-lg shadow-purple-200 dark:shadow-none disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Settings size={18} />}
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-6 py-2.5 border-2 border-red-100 hover:bg-red-50 text-red-600 rounded-xl font-semibold transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
