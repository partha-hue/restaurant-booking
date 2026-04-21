"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import {
      Users,
      Search,
      Mail,
      Phone,
      Calendar,
      Ban,
      CheckCircle,
      MoreVertical,
      UserCheck,
      UserX
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface User {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      image?: string;
      createdAt: string;
      lastLogin?: string;
      isActive?: boolean;
      role?: string;
}

export default function AdminUsers() {
      const router = useRouter();
      const { data: session, status } = useSession();
      const [users, setUsers] = useState<User[]>([]);
      const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState("");
      const [roleFilter, setRoleFilter] = useState("all");
      const [actionLoading, setActionLoading] = useState<string | null>(null);

      useEffect(() => {
            if (status === "unauthenticated") {
                  router.replace("/login");
            }
      }, [status, router]);

      useEffect(() => {
            if (status === "authenticated") {
                  fetchUsers();
            }
      }, [status]);

      useEffect(() => {
            let filtered = users;

            // Apply search filter
            if (searchTerm) {
                  filtered = filtered.filter(user =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (user.phone && user.phone.includes(searchTerm))
                  );
            }

            // Apply role filter
            if (roleFilter !== "all") {
                  filtered = filtered.filter(user => user.role === roleFilter);
            }

            setFilteredUsers(filtered);
      }, [users, searchTerm, roleFilter]);

      const fetchUsers = async () => {
            try {
                  const res = await fetch("/api/admin/users");
                  if (!res.ok) throw new Error("Failed to fetch users");
                  const data = await res.json();
                  setUsers(data);
            } catch (error) {
                  console.error("Failed to fetch users:", error);
                  toast.error("Failed to load users");
            } finally {
                  setLoading(false);
            }
      };

      const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
            const confirmMessage = {
                  activate: "Are you sure you want to activate this user?",
                  deactivate: "Are you sure you want to deactivate this user?",
                  delete: "Are you sure you want to permanently delete this user? This action cannot be undone."
            };

            if (!confirm(confirmMessage[action])) return;

            setActionLoading(userId);
            try {
                  const res = await fetch(`/api/admin/users/${userId}`, {
                        method: action === 'delete' ? 'DELETE' : 'PATCH',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action }),
                  });

                  if (!res.ok) throw new Error(`Failed to ${action} user`);

                  if (action === 'delete') {
                        setUsers(prev => prev.filter(u => u._id !== userId));
                        toast.success("User deleted successfully");
                  } else {
                        setUsers(prev => prev.map(u =>
                              u._id === userId
                                    ? { ...u, isActive: action === 'activate' }
                                    : u
                        ));
                        toast.success(`User ${action}d successfully`);
                  }
            } catch (error) {
                  console.error(`Failed to ${action} user:`, error);
                  toast.error(`Failed to ${action} user`);
            } finally {
                  setActionLoading(null);
            }
      };

      const getRoleBadge = (role?: string) => {
            if (role === 'admin') {
                  return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Admin
                        </span>
                  );
            }
            return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        User
                  </span>
            );
      };

      const getStatusBadge = (isActive?: boolean) => {
            if (isActive === false) {
                  return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Ban className="h-3 w-3 mr-1" />
                              Inactive
                        </span>
                  );
            }
            return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                  </span>
            );
      };

      if (status === "loading" || loading) {
            return (
                  <AdminLayout>
                        <div className="flex items-center justify-center h-64">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                  </AdminLayout>
            );
      }

      if (!session) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="p-6 bg-white rounded-xl shadow">
                              <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
                              <p className="text-gray-600">You don't have permission to access the admin panel.</p>
                        </div>
                  </div>
            );
      }

      return (
            <AdminLayout>
                  <Toaster position="top-right" />
                  <div className="px-4 py-8 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center sm:justify-between mb-8">
                              <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                          Manage user accounts and permissions.
                                    </p>
                              </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                    <div className="relative">
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-gray-400" />
                                          </div>
                                          <input
                                                type="text"
                                                placeholder="Search users..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                          />
                                    </div>
                              </div>

                              <div className="sm:w-48">
                                    <select
                                          value={roleFilter}
                                          onChange={(e) => setRoleFilter(e.target.value)}
                                          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                          <option value="all">All Roles</option>
                                          <option value="user">Users</option>
                                          <option value="admin">Admins</option>
                                    </select>
                              </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                              <ul className="divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                          <li key={user._id}>
                                                <div className="px-4 py-4 sm:px-6">
                                                      <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                  <div className="flex-shrink-0 h-10 w-10">
                                                                        <img
                                                                              className="h-10 w-10 rounded-full"
                                                                              src={user.image || '/default-avatar.png'}
                                                                              alt={user.name}
                                                                        />
                                                                  </div>
                                                                  <div className="ml-4">
                                                                        <div className="flex items-center">
                                                                              <h4 className="text-sm font-medium text-gray-900">
                                                                                    {user.name}
                                                                              </h4>
                                                                              <div className="ml-2 flex space-x-2">
                                                                                    {getRoleBadge(user.role)}
                                                                                    {getStatusBadge(user.isActive)}
                                                                              </div>
                                                                        </div>
                                                                        <div className="mt-1 flex items-center text-sm text-gray-600">
                                                                              <Mail className="flex-shrink-0 mr-1 h-4 w-4" />
                                                                              {user.email}
                                                                              {user.phone && (
                                                                                    <>
                                                                                          <Phone className="flex-shrink-0 ml-4 mr-1 h-4 w-4" />
                                                                                          {user.phone}
                                                                                    </>
                                                                              )}
                                                                        </div>
                                                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                                                              <Calendar className="flex-shrink-0 mr-1 h-4 w-4" />
                                                                              Joined {new Date(user.createdAt).toLocaleDateString()}
                                                                              {user.lastLogin && (
                                                                                    <> • Last login {new Date(user.lastLogin).toLocaleDateString()}</>
                                                                              )}
                                                                        </div>
                                                                        {user.address && (
                                                                              <div className="mt-1 text-sm text-gray-500">
                                                                                    📍 {user.address}
                                                                              </div>
                                                                        )}
                                                                  </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                  {user.isActive !== false ? (
                                                                        <button
                                                                              onClick={() => handleUserAction(user._id, 'deactivate')}
                                                                              disabled={actionLoading === user._id}
                                                                              className="inline-flex items-center px-3 py-1.5 border border-yellow-300 shadow-sm text-xs font-medium rounded text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                                                                        >
                                                                              <UserX className="h-4 w-4 mr-1" />
                                                                              {actionLoading === user._id ? 'Processing...' : 'Deactivate'}
                                                                        </button>
                                                                  ) : (
                                                                        <button
                                                                              onClick={() => handleUserAction(user._id, 'activate')}
                                                                              disabled={actionLoading === user._id}
                                                                              className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                                        >
                                                                              <UserCheck className="h-4 w-4 mr-1" />
                                                                              {actionLoading === user._id ? 'Processing...' : 'Activate'}
                                                                        </button>
                                                                  )}
                                                                  <button
                                                                        onClick={() => handleUserAction(user._id, 'delete')}
                                                                        disabled={actionLoading === user._id}
                                                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                                  >
                                                                        <Ban className="h-4 w-4 mr-1" />
                                                                        {actionLoading === user._id ? 'Deleting...' : 'Delete'}
                                                                  </button>
                                                            </div>
                                                      </div>
                                                </div>
                                          </li>
                                    ))}
                              </ul>

                              {filteredUsers.length === 0 && (
                                    <div className="text-center py-12">
                                          <Users className="mx-auto h-12 w-12 text-gray-400" />
                                          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                          <p className="mt-1 text-sm text-gray-500">
                                                {searchTerm || roleFilter !== "all"
                                                      ? 'Try adjusting your search or filter criteria.'
                                                      : 'No users have registered yet.'}
                                          </p>
                                    </div>
                              )}
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                              <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                          <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                      <Users className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                      <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                  Total Users
                                                            </dt>
                                                            <dd className="text-lg font-medium text-gray-900">
                                                                  {users.length}
                                                            </dd>
                                                      </dl>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                          <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                      <CheckCircle className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                      <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                  Active Users
                                                            </dt>
                                                            <dd className="text-lg font-medium text-gray-900">
                                                                  {users.filter(u => u.isActive !== false).length}
                                                            </dd>
                                                      </dl>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                          <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                      <UserCheck className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                      <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                  Admins
                                                            </dt>
                                                            <dd className="text-lg font-medium text-gray-900">
                                                                  {users.filter(u => u.role === 'admin').length}
                                                            </dd>
                                                      </dl>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </AdminLayout>
      );
}