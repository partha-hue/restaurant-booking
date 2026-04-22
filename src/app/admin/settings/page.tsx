"use client";

import Link from "next/link";
import AdminLayout from "../components/AdminLayout";

export default function AdminSettingsPage() {
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((v) => v.trim()).filter(Boolean);

        return (
                <AdminLayout>
                        <div className="px-4 py-8 sm:px-6 lg:px-8">
                                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                                <p className="text-sm text-gray-600 mt-1">Deployment and access settings relevant for admin operations.</p>

                                <div className="mt-8 bg-white shadow rounded-lg p-6 space-y-4">
                                        <div>
                                                <h2 className="text-base font-semibold text-gray-900">Admin Access Model</h2>
                                                <p className="text-sm text-gray-500">Seed admins come from environment variables. Approved requests are stored in the database and picked up automatically at login.</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                        {adminEmails.length > 0 ? (
                                                                adminEmails.map((email) => (
                                                                        <span key={email} className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                                                {email}
                                                                        </span>
                                                                ))
                                                        ) : (
                                                                <span className="text-sm text-red-600">No admin emails configured in NEXT_PUBLIC_ADMIN_EMAILS.</span>
                                                        )}
                                                </div>
                                        </div>

                                        <div className="border-t pt-4">
                                                <h2 className="text-base font-semibold text-gray-900">Production Checklist</h2>
                                                <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
                                                        <li>Set ADMIN_EMAILS in environment variables for secure server-side admin checks.</li>
                                                        <li>Set NEXTAUTH_SECRET to a strong random value.</li>
                                                        <li>Use production MongoDB URI and enforce database backups.</li>
                                                        <li>Configure Twilio and email credentials only if required.</li>
                                                </ul>
                                        </div>

                                        <div className="border-t pt-4">
                                                <Link href="/admin/requests" className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                                                        Review Admin Requests
                                                </Link>
                                        </div>
                                </div>
                        </div>
                </AdminLayout>
        );
}
