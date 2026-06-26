"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("registered") === "1") setRegistered(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("sf_user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-5 gap-1">
            <img src="/l.png" alt="Codeif" className="h-56 w-auto object-contain mix-blend-screen" />
            <span className="text-5xl font-bold text-[#F3F3F3]">Codeif</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Enter the Garage</h1>
          <p className="text-gray-400">Claim your workspace. Secure your state.</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {registered && (
              <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg text-sm">
                Account created! Sign in below.
              </div>
            )}
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7030E0] focus:ring-1 focus:ring-[#7030E0] transition-all duration-300"
                placeholder="engineer@codeif.dev"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7030E0] focus:ring-1 focus:ring-[#7030E0] transition-all duration-300"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 bg-black/50 border-gray-700 rounded accent-[#7030E0]" disabled={isLoading} />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link href="/signup" className="text-sm text-[#7030E0] hover:text-[#8B4CFF] transition-colors">
                New account?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7030E0] text-white py-3 px-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#8B4CFF] transition-all duration-300 shadow-lg shadow-[#7030E0]/50 hover:shadow-[#7030E0]/70 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Accessing..." : "Access Codeif"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900/50 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/auth/callback" })}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium border border-gray-700 flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              New to Codeif?{" "}
              <Link href="/signup" className="text-[#7030E0] hover:text-[#8B4CFF] transition-colors font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-[#7030E0] transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
