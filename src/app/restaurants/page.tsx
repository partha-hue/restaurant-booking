"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function RestaurantListPage() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurants(data);
          setError("");
        } else {
          setError("Failed to fetch restaurants");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch restaurants");
        setLoading(false);
      });
  }, []);

  const filtered = restaurants.filter(
    (r: any) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-black 
        text-gray-900 dark:text-gray-100 
        transition-colors duration-700
      "
    >
      {/* Header Search Section */}
      <div
        className="
          sticky top-0 z-20 
          bg-blue-100 dark:bg-gray-800 
          pb-2 pt-2 mb-4 
          shadow-sm rounded-b-lg 
          transition-colors duration-700
        "
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="
              flex items-center gap-2 font-bold 
              text-gray-900 dark:text-gray-200 
              bg-white dark:bg-gray-700 
              px-3 py-2 rounded shadow 
              hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-600 
              transition-all
            "
            aria-label="Go Back"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Restaurants</h1>
        </div>

        <div className="flex justify-center mt-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="
              border-2 border-primary rounded-lg px-4 py-2 
              w-full max-w-md text-lg 
              text-gray-900 dark:text-gray-100 
              bg-white dark:bg-gray-700 
              placeholder-gray-600 dark:placeholder-gray-400 
              shadow focus:outline-none focus:ring-2 focus:ring-primary
              transition-colors duration-500
            "
          />
        </div>
      </div>

      {/* Restaurant List */}
      <ul className="w-full max-w-2xl mx-auto px-4">
        {loading ? (
          <li className="text-center text-lg text-gray-700 dark:text-gray-300">
            Loading restaurants...
          </li>
        ) : error ? (
          <li className="text-center text-lg text-red-500">{error}</li>
        ) : filtered.length === 0 ? (
          <li className="text-center text-lg text-gray-700 dark:text-gray-300">
            No restaurants found.
          </li>
        ) : (
          filtered.map((r: any) => (
            <li
              key={r._id}
              className="
                group flex flex-col md:flex-row items-center justify-between 
                border-b border-gray-200 dark:border-gray-700 
                py-8 px-6 transition duration-300 
                cursor-pointer rounded-xl 
                bg-white/80 dark:bg-gray-800/70 
                hover:bg-yellow-100 dark:hover:bg-gray-700 
                hover:shadow-2xl mb-6 shadow-md
              "
            >
              <Link
                href={`/restaurants/${r._id}`}
                className="flex items-center gap-6 w-full no-underline"
              >
                <img
                  src={r.image || "/layer1.jpg"}
                  alt={r.name}
                  className="
                    w-24 h-24 object-cover rounded-xl 
                    border-2 border-yellow-300 dark:border-yellow-500 
                    shadow
                  "
                />
                <div>
                  <h2
                    className="
                      text-2xl font-extrabold mb-2 
                      bg-gradient-to-r from-blue-600 to-yellow-500 
                      px-4 py-2 rounded-lg shadow border-2 border-yellow-400 
                      text-white tracking-wide drop-shadow-lg
                      dark:from-purple-600 dark:to-yellow-400
                    "
                    style={{ letterSpacing: "1px" }}
                  >
                    {r.name}
                  </h2>
                  <p className="text-gray-800 dark:text-gray-300 mb-2 text-base font-medium leading-relaxed">
                    {r.details}
                  </p>
                  <div className="flex gap-3 text-sm mt-1">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded font-semibold shadow-sm">
                      {r.location}
                    </span>
                    <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded font-bold shadow-sm">
                      ⭐ {r.rating}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-6 md:mt-0 md:flex-row">
                <button
                  className="
                    text-lg px-6 py-2 rounded-xl font-bold shadow-lg 
                    bg-purple-600 hover:bg-purple-700 text-white 
                    dark:bg-purple-500 dark:hover:bg-purple-400 dark:text-black 
                    hover:scale-105 transition-transform
                  "
                  onClick={() => window.open(`/restaurants/${r._id}`, "_self")}
                  aria-label={`Explore ${r.name}`}
                >
                  Explore
                </button>
                <button
                  className="
                    text-lg px-6 py-2 rounded-xl font-bold shadow-lg 
                    border-2 border-purple-600 text-purple-700 
                    hover:bg-purple-600 hover:text-white 
                    dark:border-yellow-400 dark:text-yellow-300 
                    dark:hover:bg-yellow-400 dark:hover:text-black 
                    hover:scale-105 transition-transform
                  "
                  onClick={() => window.open(`/book/${r._id}`, "_self")}
                  aria-label={`Book ${r.name}`}
                >
                  Book
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <footer
        className="
          mt-12 py-8 w-full text-center text-sm 
          bg-white dark:bg-gray-900 rounded-lg shadow 
          text-gray-700 dark:text-gray-300 
          transition-colors duration-700
        "
      >
        <div className="mb-2 font-bold text-xl text-primary dark:text-yellow-400">
          Food Hub &copy; 2025
        </div>
        <div className="mb-2">
          Discover and book the best restaurants. Made with{" "}
          <span className="text-red-500">❤️</span> for food lovers.
        </div>
        <div className="mb-2">
          Contact:{" "}
          <a
            href="mailto:support@foodhub.com"
            className="underline text-blue-600 dark:text-yellow-400"
          >
            support@foodhub.com
          </a>{" "}
          | Phone:{" "}
          <a
            href="tel:+919999999999"
            className="underline text-blue-600 dark:text-yellow-400"
          >
            +91 99999 99999
          </a>
        </div>

        <div className="mb-2 flex justify-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-700 dark:hover:text-yellow-400"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            className="hover:text-pink-600 dark:hover:text-yellow-400"
          >
            Instagram
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-400 dark:hover:text-yellow-400"
          >
            Twitter
          </a>
        </div>

        <div className="mb-2 flex justify-center gap-4">
          <Link
            href="/restaurants"
            className="hover:underline text-blue-700 dark:text-yellow-400 font-semibold"
          >
            Restaurants
          </Link>
          <Link
            href="/bookings"
            className="hover:underline text-blue-700 dark:text-yellow-400 font-semibold"
          >
            Bookings
          </Link>
          <Link
            href="/userprofile"
            className="hover:underline text-blue-700 dark:text-yellow-400 font-semibold"
          >
            Profile
          </Link>
        </div>

        <div className="max-w-xl mx-auto text-xs text-gray-500 dark:text-gray-400 mt-2">
          Food Hub is your one-stop platform to discover, explore, and book the best
          restaurants in your city. We aim to make dining out easy, enjoyable, and
          rewarding for everyone. Join us and experience the joy of great food and
          seamless booking!
        </div>
      </footer>
    </div>
  );
}
