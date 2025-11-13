"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function RestaurantDetailsPage({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState<any>(null);
  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRestaurant(data.find((r: any) => r._id === params.id));
        } else {
          setRestaurant(null);
        }
      })
      .catch(() => setRestaurant(null));
  }, [params.id]);

  if (!restaurant) return <div className="text-center mt-20 text-lg text-gray-700">No restaurant found.</div>;

  // Add more info for demo
  const extraInfo = {
    cuisine:
      restaurant._id === "1"
        ? "Indian"
        : restaurant._id === "2"
          ? "Japanese"
          : restaurant._id === "3"
            ? "Italian"
            : restaurant._id === "4"
              ? "American"
              : restaurant._id === "5"
                ? "North Indian"
                : "Vegan",
    contact:
      restaurant._id === "1"
        ? "+91 98765 43210"
        : restaurant._id === "2"
          ? "+91 91234 56789"
          : restaurant._id === "3"
            ? "+91 99887 77665"
            : restaurant._id === "4"
              ? "+91 90000 11122"
              : restaurant._id === "5"
                ? "+91 88888 55555"
                : "+91 77777 33333",
    hours: "11:00 AM - 11:00 PM",
    price:
      restaurant._id === "1"
        ? "₹800 for two"
        : restaurant._id === "2"
          ? "₹1200 for two"
          : restaurant._id === "3"
            ? "₹900 for two"
            : restaurant._id === "4"
              ? "₹600 for two"
              : restaurant._id === "5"
                ? "₹850 for two"
                : "₹700 for two",
    map: "[Map Placeholder]",
    menu:
      restaurant._id === "1"
        ? [
          { name: "Paneer Tikka", price: "₹250" },
          { name: "Butter Chicken", price: "₹350" },
          { name: "Dal Makhani", price: "₹200" },
        ]
        : restaurant._id === "2"
          ? [
            { name: "Sushi Platter", price: "₹600" },
            { name: "Ramen Bowl", price: "₹400" },
            { name: "Tempura", price: "₹350" },
          ]
          : restaurant._id === "3"
            ? [
              { name: "Margherita Pizza", price: "₹300" },
              { name: "Pasta Alfredo", price: "₹350" },
              { name: "Tiramisu", price: "₹250" },
            ]
            : restaurant._id === "4"
              ? [
                { name: "Classic Burger", price: "₹180" },
                { name: "Cheese Fries", price: "₹120" },
                { name: "Veggie Burger", price: "₹160" },
              ]
              : restaurant._id === "5"
                ? [
                  { name: "Chicken Tandoori", price: "₹320" },
                  { name: "Paneer Tikka", price: "₹250" },
                  { name: "Naan Basket", price: "₹150" },
                ]
                : [
                  { name: "Green Salad", price: "₹200" },
                  { name: "Vegan Bowl", price: "₹350" },
                  { name: "Fruit Smoothie", price: "₹180" },
                ],
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center relative">
      <button
        className="absolute top-6 left-6 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
        onClick={() => window.history.back()}
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-black">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <img src={restaurant.image} alt={restaurant.name} className="w-full max-w-md h-48 object-cover rounded mb-4" />
      <h1 className="text-2xl font-bold text-black mb-2">{restaurant.name}</h1>
      <p className="text-gray-900 mb-2">{restaurant.details}</p>
      <div className="flex flex-wrap gap-4 mb-4">
        <span className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-semibold">{restaurant.location}</span>
        <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-bold">⭐ {restaurant.rating}</span>
        <span className="px-3 py-1 rounded bg-blue-100 text-blue-800 font-semibold">Cuisine: {extraInfo.cuisine}</span>
      </div>
      <div className="mb-2 text-sm text-gray-700">Contact: <span className="font-bold">{extraInfo.contact}</span></div>
      <div className="mb-2 text-sm text-gray-700">Opening Hours: <span className="font-bold">{extraInfo.hours}</span></div>
      <div className="mb-2 text-sm text-gray-700">Average Price: <span className="font-bold">{extraInfo.price}</span></div>
      <div className="mb-4 text-sm text-gray-700">Location Map: <span className="font-bold">{extraInfo.map}</span></div>
      <div className="mb-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-black mb-2">Menu Highlights</h2>
        <ul className="divide-y">
          {extraInfo.menu.map(item => (
            <li key={item.name} className="flex justify-between py-2 text-gray-900">
              <span>{item.name}</span>
              <span className="font-bold">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>
      <Link href={`/book/${restaurant._id}`} className="px-4 py-2 text-blue bg-blue-400 btn btn-ghost btn-dash btn-error w-full max-w-md block text-center">Book This Restaurant</Link>
    </div>
  );
}
