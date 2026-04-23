"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRequestAccessPage() {
        const router = useRouter();

        useEffect(() => {
                router.replace("/signup?admin=1&next=%2Fadmin");
        }, []);

        return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-cyan-50 flex items-center justify-center px-4 py-12">
                        <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">
                                <div className="mb-6 text-center">
                                        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">FoodHub Admin</p>
                                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Redirecting to Admin Sign Up</h1>
                                        <p className="mt-3 text-slate-600">
                                                The admin flow now uses a simple sign up and login path.
                                        </p>
                                </div>

                                <div className="flex items-center justify-center gap-3">
                                        <Link href="/signup?admin=1&next=%2Fadmin" className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700">
                                                Continue to Admin Sign Up
                                        </Link>
                                </div>
                        </div>
                </div>
        );
}
