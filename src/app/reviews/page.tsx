"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Submit review
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setForm({ name: "", rating: 5, message: "" });
        setShowForm(false);
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch {
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  // Average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingCount = [5, 4, 3, 2, 1].map(
    (r) => reviews.filter((rev) => rev.rating === r).length
  );

  return (
    <section
      className={`min-h-screen p-6 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-yellow-50 to-purple-50 text-gray-900"
      }`}
    >
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-wide text-center md:text-left">
          User Reviews & Ratings
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full transition-colors duration-300 
          bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Collapsible Review Form */}
      <div className="max-w-xl mx-auto mb-10">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full flex justify-between items-center p-4 rounded-xl font-semibold text-lg shadow-md transition-all ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        >
          {showForm ? "Hide Review Form" : "Add Your Review"}
          {showForm ? <ChevronUp /> : <ChevronDown />}
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`overflow-hidden mt-4 p-6 rounded-2xl shadow-lg ${
                darkMode ? "bg-gray-800/70" : "bg-white/90"
              }`}
            >
              <h2 className="text-2xl font-semibold text-center mb-6">
                Share Your Experience 🌟
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 rounded-lg border bg-transparent 
                    border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    className="w-full p-3 rounded-lg border bg-transparent 
                    border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option
                        key={r}
                        value={r}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {"⭐".repeat(r)} ({r})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Review</label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={4}
                    className="w-full p-3 rounded-lg border bg-transparent 
                    border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                    placeholder="Write your thoughts..."
                    required
                  ></textarea>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg text-lg font-semibold text-white
                  bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600
                  transition-all duration-300 shadow-lg"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto text-center mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">
            Average Rating:{" "}
            <span className="text-yellow-400">{averageRating} ⭐</span>
          </h3>

          {[5, 4, 3, 2, 1].map((r, i) => {
            const percent = ((ratingCount[i] / reviews.length) * 100).toFixed(0);
            return (
              <div key={r} className="flex items-center mb-2 text-sm">
                <span className="w-10">{r}⭐</span>
                <div className="flex-1 h-3 rounded bg-gray-300 dark:bg-gray-700 mx-2">
                  <div
                    className="h-3 bg-yellow-400 rounded transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-6 text-gray-500">{ratingCount[i]}</span>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Reviews Display */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">
          What Our Users Say ❤️
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-xl border transition-all ${
                  darkMode
                    ? "bg-gray-800/60 border-gray-700"
                    : "bg-white/80 border-gray-200"
                } hover:shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h4 className="font-bold text-lg">{r.name}</h4>
                  <span className="text-yellow-400 mt-1 sm:mt-0">
                    {"⭐".repeat(r.rating)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{r.message}</p>
                <p className="text-xs mt-2 text-gray-500">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
