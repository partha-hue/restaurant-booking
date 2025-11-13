"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaSearch } from "react-icons/fa";
import BookingCard from "@/component/BookingCard";

interface Booking {
  _id: string;
  restaurantName: string;
  name: string;
  date: string;
  phone: string;
  createdAt: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter bookings on search input and whenever bookings/search change
  const filteredBookings = bookings.filter(b => {
    const restaurant = b.restaurantName?.toLowerCase() || "";
    const name = b.name?.toLowerCase() || "";
    const phone = b.phone || "";
    const s = search.toLowerCase();
    return (
      restaurant.includes(s) ||
      name.includes(s) ||
      phone.includes(s)
    );
  });

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Toggle item selection
  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Delete selected bookings
  const handleDelete = async () => {
    if (selected.length === 0) return;
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setBookings(prev => prev.filter(b => !selected.includes(b._id)));
      setSelected([]);
    } catch (error) {
      console.error("Error deleting bookings:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header with Search */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-lg">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by restaurant name, user, or phone..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none"
          />
        </div>

        {selected.length > 0 && (
          <button
            onClick={handleDelete}
            className="ml-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaTrash /> Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Booking Cards Grid */}
      <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-center w-full text-gray-500">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center w-full text-gray-500">No bookings found.</p>
        ) : (
          filteredBookings.map(booking => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookingCard
                booking={booking}
                selected={selected.includes(booking._id)}
                onSelect={() => toggleSelect(booking._id)}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
