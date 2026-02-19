"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { User, Mail, LogOut, Camera, Shield, Settings } from "lucide-react";
import Image from "next/image";

interface ProfileClientProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden transition-colors duration-300">
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-lg">
              {user.image ? (
                <Image src={user.image} alt={user.name || "User"} width={128} height={128} className="object-cover" />
              ) : (
                <User className="w-full h-full p-6 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </button>
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-bold text-white mb-1">{user.name || "Foodie"}</h1>
            <p className="text-purple-100 flex items-center gap-2">
              <Mail size={14} /> {user.email}
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
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.name || "Not set"}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">User ID</p>
                <p className="text-xs font-mono text-gray-400">{user.id}</p>
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
                <button className="btn btn-sm btn-outline">Enable</button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t dark:border-gray-700">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition shadow-lg shadow-purple-200 dark:shadow-none">
            <Settings size={18} /> Update Profile
          </button>
          <button
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
