"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side - Logo */}
          <Link href="/" className="flex items-center gap-1">
            <img
              src="/l.png"
              alt="Codeif"
              className="h-16 w-auto object-contain mix-blend-screen"
            />
            <span className="text-2xl font-bold text-[#F3F3F3]">
              Codeif
            </span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 text-sm uppercase tracking-wider hover:text-white transition-all duration-300"
            >
              HOME
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-300 text-sm uppercase tracking-wider hover:text-white transition-all duration-300"
            >
              LEADERBOARD
            </Link>
            <Link
              href="/faq"
              className="text-gray-300 text-sm uppercase tracking-wider hover:text-white transition-all duration-300"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 text-sm uppercase tracking-wider hover:text-white transition-all duration-300"
            >
              CONTACT
            </Link>
          </div>

          {/* Right Side - Start Button */}
          <div className="hidden md:block">
            <button
              onClick={() => (window.location.href = "/login")}
              className="group relative bg-white text-black px-10 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-[#7030E0]/40 hover:shadow-[#7030E0]/60 hover:scale-105 border border-[#7030E0]/20 hover:border-[#7030E0]/40 rounded-sm overflow-hidden"
            >
              <span className="relative z-10">START</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7030E0]/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-500"></div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-[#7030E0] p-2 transition-colors">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700">
        <div className="px-4 py-4 space-y-3">
          <Link
            href="/"
            className="text-gray-300 block text-sm uppercase tracking-wider hover:text-white transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/leaderboard"
            className="text-gray-300 block text-sm uppercase tracking-wider hover:text-white transition-colors"
          >
            LEADERBOARD
          </Link>
          <Link
            href="/faq"
            className="text-gray-300 block text-sm uppercase tracking-wider hover:text-white transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 block text-sm uppercase tracking-wider hover:text-white transition-colors"
          >
            CONTACT
          </Link>
          <button
            onClick={() => (window.location.href = "/login")}
            className="group relative w-full bg-white text-black px-10 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-[#7030E0]/40 hover:shadow-[#7030E0]/60 hover:scale-105 border border-[#7030E0]/20 hover:border-[#7030E0]/40 rounded-sm mt-4 overflow-hidden"
          >
            <span className="relative z-10">START</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7030E0]/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-500"></div>
          </button>
        </div>
      </div>
    </nav>
  );
}
