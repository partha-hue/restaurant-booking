"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { CheckCircle, Clock3, Search, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type AdminRequest = {
        _id: string;
        name: string;
        email: string;
        company?: string;
        reason: string;
        status: "pending" | "approved" | "rejected";
        createdAt: string;
        reviewedAt?: string;
        reviewedBy?: string;
};

export default function AdminRequestsPage() {
        const [requests, setRequests] = useState<AdminRequest[]>([]);
        const [filteredRequests, setFilteredRequests] = useState<AdminRequest[]>([]);
        const [loading, setLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState("");
        const [statusFilter, setStatusFilter] = useState("pending");
        const [busyId, setBusyId] = useState<string | null>(null);

        useEffect(() => {
                void fetchRequests();
        }, []);

        useEffect(() => {
                const filtered = requests.filter((item) => {
                        const matchesSearch = [item.name, item.email, item.company || "", item.reason]
                                .join(" ")
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase());
                        const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
                        return matchesSearch && matchesStatus;
                });

                setFilteredRequests(filtered);
        }, [requests, searchTerm, statusFilter]);

        const fetchRequests = async () => {
                try {
                        const response = await fetch("/api/admin/requests", { cache: "no-store" });
                        if (!response.ok) throw new Error("Failed to load requests");
                        const data = await response.json();
                        setRequests(data);
                } catch (error) {
                        console.error(error);
                        toast.error("Failed to load admin requests");
                } finally {
                        setLoading(false);
                }
        };

        const updateRequest = async (requestId: string, action: "approve" | "reject") => {
                setBusyId(requestId);
                try {
                        const response = await fetch("/api/admin/requests", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ requestId, action }),
                        });

                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || "Failed to update request");

                        setRequests((prev) => prev.map((item) => (item._id === requestId ? { ...item, status: data.status } : item)));
                        toast.success(action === "approve" ? "Request approved" : "Request rejected");
                } catch (error: any) {
                        toast.error(error.message || "Failed to update request");
                } finally {
                        setBusyId(null);
                }
        };

        return (
                <AdminLayout>
                        <Toaster position="top-right" />
                        <div className="px-4 py-8 sm:px-6 lg:px-8">
                                <div className="flex items-start justify-between gap-4 flex-col md:flex-row md:items-center mb-8">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">Admin Access Requests</h1>
                                                <p className="text-sm text-gray-600 mt-1">Review and approve admin access for trusted users.</p>
                                        </div>

                                        <div className="flex gap-3 w-full md:w-auto flex-col sm:flex-row">
                                                <div className="relative">
                                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <input
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                placeholder="Search requests"
                                                                className="w-full sm:w-64 rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm"
                                                        />
                                                </div>
                                                <select
                                                        value={statusFilter}
                                                        onChange={(e) => setStatusFilter(e.target.value)}
                                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="all">All</option>
                                                </select>
                                        </div>
                                </div>

                                {loading ? (
                                        <div className="flex items-center justify-center py-16">
                                                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600" />
                                        </div>
                                ) : filteredRequests.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                                                No admin access requests found.
                                        </div>
                                ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                                {filteredRequests.map((item) => (
                                                        <div key={item._id} className="rounded-xl border bg-white p-5 shadow-sm">
                                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                                        <div className="space-y-2">
                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                        <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                                                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "approved" ? "bg-green-100 text-green-800" : item.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                                                                {item.status === "approved" ? <CheckCircle className="mr-1 h-3 w-3" /> : item.status === "rejected" ? <XCircle className="mr-1 h-3 w-3" /> : <Clock3 className="mr-1 h-3 w-3" />}
                                                                                                {item.status}
                                                                                        </span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-600">{item.email}</p>
                                                                                {item.company && <p className="text-sm text-gray-500">{item.company}</p>}
                                                                                <p className="max-w-3xl text-sm text-gray-700 whitespace-pre-wrap">{item.reason}</p>
                                                                                <p className="text-xs text-gray-400">Submitted {new Date(item.createdAt).toLocaleString()}</p>
                                                                        </div>

                                                                        <div className="flex gap-2">
                                                                                {item.status === "pending" && (
                                                                                        <>
                                                                                                <button
                                                                                                        onClick={() => updateRequest(item._id, "approve")}
                                                                                                        disabled={busyId === item._id}
                                                                                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                                                                >
                                                                                                        {busyId === item._id ? "Processing..." : "Approve"}
                                                                                                </button>
                                                                                                <button
                                                                                                        onClick={() => updateRequest(item._id, "reject")}
                                                                                                        disabled={busyId === item._id}
                                                                                                        className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                                                                >
                                                                                                        Reject
                                                                                                </button>
                                                                                        </>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                )}
                        </div>
                </AdminLayout>
        );
}
