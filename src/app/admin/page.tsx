"use client";
import { useRouter } from "next/navigation";
import Router from "next/router";
import React, { useState } from "react";

// Hardcoded admin email for demo
const ADMIN_EMAIL = "admin@foodhub.com";

export default function AdminPage() {
      const router = useRouter();
      const [email, setEmail] = useState("");
      const [isAdmin, setIsAdmin] = useState(false);
      const [form, setForm] = useState({ name: "", location: "", rating: "", details: "", image: "" });
      const [success, setSuccess] = useState("");
      const [error, setError] = useState("");

      const handleLogin = (e: React.FormEvent) => {
            e.preventDefault();
            if (email.trim().toLowerCase() === ADMIN_EMAIL) {
                  setIsAdmin(true);
                  setError("");
            } else {
                  setError("Access denied: Not an admin email.");
            }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSuccess("");
            setError("");
            if (!form.name || !form.location || !form.rating || !form.details) {
                  setError("All fields are required.");
                  return;
            }
            const res = await fetch("/api/restaurants", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...form, rating: parseFloat(form.rating) })
            });
            const data = await res.json();
            if (data.success) {
                  setSuccess("Restaurant added successfully!");
                  setForm({ name: "", location: "", rating: "", details: "", image: "" });
            } else {
                  setError(data.error || "Failed to add restaurant.");
            }
      };

      return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 p-8">
                  <div className="bg-white/90 rounded-xl shadow-xl p-8 max-w-lg w-full">
                        <h1 className="text-3xl font-bold text-primary mb-4 text-center">Admin Dashboard</h1>
                        {!isAdmin ? (
                              <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center">
                                    <input
                                          type="email"
                                          value={email}
                                          onChange={e => setEmail(e.target.value)}
                                          placeholder="Enter admin email"
                                          className="input input-bordered w-full max-w-xs"
                                          required
                                    />
                                    <button className="btn btn-primary w-full" type="submit">Login as Admin</button>
                                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                              </form>
                        ) : (
                              <>
                                    <p className="text-gray-700 mb-6 text-center">Welcome, Admin! Upload new restaurants below.</p>
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                          <input name="name" value={form.name} onChange={handleChange} placeholder="Restaurant Name" className="input input-bordered" required />
                                          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input input-bordered" required />
                                          <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating (e.g. 4.5)" className="input input-bordered" required type="number" step="0.1" min="0" max="5" />
                                          <textarea name="details" value={form.details} onChange={handleChange} placeholder="Details" className="textarea textarea-bordered" required />
                                          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL (optional)" className="input input-bordered" />
                                          <button className="btn btn-primary mt-2" type="submit">Add Restaurant</button>
                                          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                                          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                                                

                                    </form>
                                 <button className="btn btn-secondary mt-4" onClick={() => router.push("/admin/offers")}> offers</button>
                              </>
                        )}
                  </div>
            </div>
      );
}
