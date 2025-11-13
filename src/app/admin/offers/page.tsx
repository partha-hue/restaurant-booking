"use client";
import React, { useState } from "react";

export default function AdminOffersPage() {
  const [formData, setFormData] = useState({
    restaurantId: "",
    restaurantName: "",
    offerTitle: "",
    offerDescription: "",
    offerImage: "",
    validUntil: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Offer uploaded successfully!");
        setFormData({
          restaurantId: "",
          restaurantName: "",
          offerTitle: "",
          offerDescription: "",
          offerImage: "",
          validUntil: "",
        });
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ Failed to upload offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-purple-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-900 mb-6">Admin Panel - Upload Offer</h1>
        {message && <p className="text-center font-semibold mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="restaurantId" value={formData.restaurantId} onChange={handleChange} placeholder="Restaurant ID" className="input input-bordered w-full" required />
          <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} placeholder="Restaurant Name" className="input input-bordered w-full" required />
          <input type="text" name="offerTitle" value={formData.offerTitle} onChange={handleChange} placeholder="Offer Title" className="input input-bordered w-full" required />
          <textarea name="offerDescription" value={formData.offerDescription} onChange={handleChange} placeholder="Offer Description" className="textarea textarea-bordered w-full" required />
          <input type="text" name="offerImage" value={formData.offerImage} onChange={handleChange} placeholder="Offer Image URL" className="input input-bordered w-full" required />
          <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} className="input input-bordered w-full" required />
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Uploading..." : "Upload Offer"}
          </button>
        </form>
      </div>
    </div>
  );
}
