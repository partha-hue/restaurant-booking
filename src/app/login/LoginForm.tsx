"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  // ---------- States ----------
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // ---------- Dark Mode ----------
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ---------- Handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
        callbackUrl: "/dashboard",
      });

      setLoading(false);

      if (res?.error) setError(res.error);
      else router.replace("/dashboard");
    } catch {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  // OTP login
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    if (!otpSent) {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) setError(data.error || "Failed to send OTP");
      else { setOtpSent(true); setSuccess("OTP sent!"); }
    } else {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) setError(data.error || "Invalid OTP");
      else router.replace("/dashboard");
    }
  };

  const resetOtp = () => {
    setOtpMode(false); setOtpSent(false); setOtp(""); setError(""); setSuccess("");
  };

  // ---------- JSX ----------
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"}`}>
      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className={`p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Welcome Back</h1>
        <p className="text-center text-gray-500 dark:text-gray-400">Log in to continue</p>

        {!otpMode && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="border p-3 w-full rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="border p-3 w-full rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button type="submit" className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Logging in..." : "Login"}</button>
          </form>
        )}

        {otpMode && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="border p-3 w-full rounded-lg dark:bg-gray-700 dark:border-gray-600" required disabled={otpSent} />
            {otpSent && <input name="otp" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="border p-3 w-full rounded-lg dark:bg-gray-700 dark:border-gray-600" required />}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button type="submit" className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}</button>
            <button type="button" className="text-blue-600 dark:text-blue-400 underline w-full mt-2" onClick={resetOtp}>Back to password login</button>
          </form>
        )}

        <div className="flex items-center my-2">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          <span className="px-2 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" /> Continue with Google
        </button>

        {!otpMode && (
          <button onClick={() => setOtpMode(true)} className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <span className="mr-2">🔑</span> Sign in with OTP
          </button>
        )}
      </div>
    </div>
  );
}
