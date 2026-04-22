"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRequestAccessPage() {
        const router = useRouter();
        const [form, setForm] = useState({ name: "", email: "", company: "", reason: "" });
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

        const handleSubmit = async (event: React.FormEvent) => {
                event.preventDefault();
                setLoading(true);
                setMessage(null);

                try {
                        const response = await fetch("/api/admin/requests", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(form),
                        });

                        const data = await response.json();
                        if (!response.ok) {
                                throw new Error(data.error || "Failed to submit request");
                        }

                        setMessage({ type: "success", text: "Request submitted. Admin will review your access." });
                        setForm({ name: "", email: "", company: "", reason: "" });
                        setTimeout(() => router.push("/login?next=%2Fadmin"), 1200);
                } catch (error: any) {
                        setMessage({ type: "error", text: error.message || "Something went wrong" });
                } finally {
                        setLoading(false);
                }
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
        };

        return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-cyan-50 flex items-center justify-center px-4 py-12">
                        <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">
                                <div className="mb-6 text-center">
                                        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">FoodHub Admin</p>
                                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Request Admin Access</h1>
                                        <p className="mt-3 text-slate-600">
                                                Admin accounts are approved manually for security. Submit your details and we’ll review access.
                                        </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Full name"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="Work email"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                                name="company"
                                                value={form.company}
                                                onChange={handleChange}
                                                placeholder="Company or restaurant group"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <textarea
                                                name="reason"
                                                value={form.reason}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="Why do you need admin access?"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                                {loading ? "Submitting..." : "Submit Request"}
                                        </button>
                                </form>

                                {message && (
                                        <p className={`mt-4 text-sm text-center ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                                {message.text}
                                        </p>
                                )}

                                <div className="mt-6 text-center text-sm text-slate-600">
                                        Already approved? <Link href="/login?next=%2Fadmin" className="font-medium text-indigo-600 hover:underline">Sign in</Link>
                                </div>
                        </div>
                </div>
        );
}
