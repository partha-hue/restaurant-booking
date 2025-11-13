"use client";
import React from 'react'

import { useRouter } from 'next/navigation';
export default function ContactPage() {
      const router = useRouter();
      return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-purple-100 p-4">
                  <div className="w-full max-w-xl flex justify-between mb-4">
                        <button onClick={() => router.back()} className="btn  btn-primary btn-sm">
                              ← Back
                        </button>
                        <button onClick={() => router.push('/home')} className="btn btn-primary btn-sm">
                              Home
                        </button>
                  </div>
                  <div className="w-full max-w-xl  shadow-2xl p-8 animate-fade-in-up">
                        <div className="flex flex-col items-center mb-8">
                              <img src="/foodhub-logo.svg" alt="FoodHub Logo" className="w-16 h-16 mb-2 animate-bounce" />
                              <h1 className="text-4xl font-bold text-black mb-2 animate-fade-in">Contact FoodHub</h1>
                              <p className="text-md text-gray-700 text-center bg-yellow-50 rounded-lg px-4 py-2 animate-fade-in-delay">
                                    Have questions, feedback, or need support? We're here to help! Reach out to us using the form below or call us directly.
                              </p>
                              <div className="mt-4 text-lg font-semibold text-black animate-fade-in-up">
                                    📞 Contact Number: <span className="text-primary">+91 8327692524</span>
                              </div>
                        </div>
                        <form className="space-y-6 animate-fade-in-up" onSubmit={e => {e.preventDefault(); alert('Thank you for contacting us!')}}>
                              <div>
                                    <label className="block text-black font-semibold mb-1">Name</label>
                                    <input type="text" className="input input-bordered w-full bg-white text-black" placeholder="Your Name" required />
                              </div>
                              <div>
                                    <label className="block text-black font-semibold mb-1">Email</label>
                                    <input type="email" className="input input-bordered w-full bg-white text-black" placeholder="you@email.com" required />
                              </div>
                              <div>
                                    <label className="block text-black font-semibold mb-1">Message</label>
                                    <textarea className="textarea textarea-bordered w-full bg-white text-black" rows={4} placeholder="Type your message..." required></textarea>
                              </div>
                              <button type="submit" className="btn btn-primary w-full animate-pulse">Send Message</button>
                        </form>
                  </div>
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
                        @keyframes fadeIn {
                              from { opacity: 0; }
                              to { opacity: 1; }
                        }
                        @keyframes fadeInUp {
                              from { opacity: 0; transform: translateY(40px); }
                              to { opacity: 1; transform: translateY(0); }
                        }
                  `}</style>
            </div>
      );
}