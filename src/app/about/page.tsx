"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react'

export default function AboutPage(): React.JSX.Element {
  const router = useRouter();
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center p-0">
        {/* Animated Navbar */}
        <nav className="w-full flex justify-between items-center px-8 py-4 bg-scroll bg-sky-300/80 shadow-md sticky top-0 z-20 animate-navbar-fade-in">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}> 
            <Image src="/globe.svg" alt="Food Hub Logo" width={32} height={32} className="animate-spin-slow" />
            <span className="font-bold text-xl text-primary">Food Hub</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/")} className="btn btn-ghost btn-primary btn-sm text-base font-semibold hover:scale-105 transition-transform duration-200 text-shadow-background text-black">Home</button>
            <button onClick={() => router.push("/userprofile")}
              className="btn btn-ghost btn-sm btn-primary text-base font-semibold hover:scale-105 transition-transform duration-200  text-shadow-background text-black">
              Account
            </button>
          </div>
        </nav>
      <div className="w-full max-w-2xl">
        <div className="hero rounded-xl shadow-xl bg-white/80 animate-fade-in-up">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <Image
              src="/foodhub-logo.svg"
              width={320}
              height={320}
              className="max-w-xs rounded-lg shadow-2xl animate-bounce"
              alt="About Food Hub"
            />
            <div>
              <h1 className="text-5xl font-bold text-primary animate-fade-in">Welcome to Food Hub!</h1>
              <p className="py-6 text-lg text-gray-700 animate-fade-in-delay">
                Food Hub is your one-stop platform to discover, review, and book the best restaurants in your city. Our mission is to connect food lovers with amazing dining experiences, making it easy to find, rate, and reserve your next meal.
              </p>
              <button onClick={()=>router.push("/home")} className="btn btn-primary animate-pulse">Get Started</button>
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl animate-fade-in-up">
            <div className="card-body">
              <h2 className="card-title text-secondary">Our Vision</h2>
              <p>
                To make dining out effortless and enjoyable for everyone, everywhere. We believe in the power of great food and great company.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl animate-fade-in-up">
            <div className="card-body">
              <h2 className="card-title text-secondary">Meet the Team</h2>
              <p>
                We are a passionate group of foodies, designers, and developers dedicated to building the best restaurant discovery and booking platform.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Animations using Tailwind */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1.5s ease-in;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-in;
        }
        .animate-navbar-fade-in {
          animation: fadeInNavbar 1s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInNavbar {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
