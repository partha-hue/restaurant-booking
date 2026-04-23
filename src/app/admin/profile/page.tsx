"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";

type AdminProfile = {
        email: string;
        name: string;
        phone: string;
        address: string;
        image: string;
        company: string;
        approvedAt?: string | null;
        approvedBy?: string | null;
        createdAt?: string | null;
        lastLogin?: string | null;
};

export default function AdminProfilePage() {
        const router = useRouter();
        const { data: session, status } = useSession();
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [profile, setProfile] = useState<AdminProfile | null>(null);
        const [form, setForm] = useState({
                name: "",
                phone: "",
                address: "",
                image: "",
                company: "",
        });

        useEffect(() => {
                if (status === "unauthenticated") {
                        router.replace("/login?next=%2Fadmin%2Fprofile");
                }
        }, [status, router]);

        useEffect(() => {
                if (status === "authenticated") {
                        void fetchProfile();
                }
        }, [status]);

        const fetchProfile = async () => {
                setLoading(true);
                try {
                        const response = await fetch("/api/admin/profile", { cache: "no-store" });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || "Failed to fetch profile");
                        setProfile(data);
                        setForm({
                                name: data.name || "",
                                phone: data.phone || "",
                                address: data.address || "",
                                image: data.image || "",
                                company: data.company || "",
                        });
                } catch (error: any) {
                        toast.error(error.message || "Failed to load profile");
                } finally {
                        setLoading(false);
                }
        };

        const handleSave = async (event: React.FormEvent) => {
                event.preventDefault();
                setSaving(true);
                try {
                        const response = await fetch("/api/admin/profile", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(form),
                        });

                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || "Failed to update profile");

                        setProfile((prev) => {
                                if (!prev) return prev;
                                return {
                                        ...prev,
                                        ...data.profile,
                                };
                        });
                        toast.success("Profile updated");
                } catch (error: any) {
                        toast.error(error.message || "Failed to update profile");
                } finally {
                        setSaving(false);
                }
        };

        if (status === "loading" || loading) {
                return (
                        <AdminLayout>
                                <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                                </div>
                        </AdminLayout>
                );
        }

        if (!session || !profile) {
                return null;
        }

        return (
                <AdminLayout>
                        <Toaster position="top-right" />
                        <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
                                <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                                <p className="mt-1 text-sm text-gray-600">Manage your admin account details.</p>

                                <div className="mt-6 bg-white rounded-xl shadow border p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div>
                                                        <p className="font-medium text-gray-900">Email</p>
                                                        <p>{profile.email}</p>
                                                </div>
                                                <div>
                                                        <p className="font-medium text-gray-900">Approved By</p>
                                                        <p>{profile.approvedBy || "signup"}</p>
                                                </div>
                                                <div>
                                                        <p className="font-medium text-gray-900">Approved At</p>
                                                        <p>{profile.approvedAt ? new Date(profile.approvedAt).toLocaleString() : "-"}</p>
                                                </div>
                                                <div>
                                                        <p className="font-medium text-gray-900">Last Login</p>
                                                        <p>{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "-"}</p>
                                                </div>
                                        </div>

                                        <form onSubmit={handleSave} className="mt-6 space-y-4">
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                        <input
                                                                value={form.name}
                                                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                                required
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                        <input
                                                                value={form.phone}
                                                                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business / Company</label>
                                                        <input
                                                                value={form.company}
                                                                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                        <textarea
                                                                value={form.address}
                                                                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                                                                rows={3}
                                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                                                        <input
                                                                value={form.image}
                                                                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        />
                                                </div>

                                                <button
                                                        type="submit"
                                                        disabled={saving}
                                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                        {saving ? "Saving..." : "Save Profile"}
                                                </button>
                                        </form>
                                </div>
                        </div>
                </AdminLayout>
        );
}
