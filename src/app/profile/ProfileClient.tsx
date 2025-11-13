"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
}

interface ProfileProps {
  user?: UserProfile;
}

export default function ProfileClient({ user }: ProfileProps) {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    image: user?.image || "/default-avatar.png",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch latest profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile");
        const data = await res.json();
        if (data) setProfile({ ...profile, ...data });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) setEditMode(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-gray-100 dark:bg-gray-900 transition-colors">
      
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-semibold hover:scale-105 transition"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
        <img
          src={profile.image || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{profile.name}</h2>
        <p className="text-center text-gray-500 dark:text-gray-300">{profile.email}</p>

        {editMode ? (
          <div className="w-full mt-4 space-y-3">
            <input
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Phone"
            />
            <input
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="Address"
            />
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="w-full mt-4 space-y-1 text-gray-700 dark:text-gray-300 text-center">
            <p>📞 {profile.phone || "No phone"}</p>
            <p>📍 {profile.address || "No address"}</p>
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded transition mt-3"
            >
              Edit
            </button>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
