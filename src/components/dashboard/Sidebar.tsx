"use client";

import type { FC } from "react";

type Section = "stack" | "rank";

interface User {
  name: string;
  email: string;
  avatarColor?: string;
}

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
  user?: User;
}

const StackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <rect x="2" y="10" width="20" height="5" rx="1" />
    <rect x="2" y="17" width="20" height="5" rx="1" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h2" />
    <path d="M18 9h2a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1h-2" />
    <path d="M4 22h16" />
    <path d="M10 22v-4" />
    <path d="M14 22v-4" />
    <path d="M8 4h8v8a4 4 0 0 1-4 4 4 4 0 0 1-4-4Z" />
  </svg>
);

const navItems: { id: Section; label: string; icon: FC; description: string }[] = [
  { id: "stack", label: "Stack", icon: StackIcon, description: "1000+ Questions" },
  { id: "rank", label: "Rank", icon: TrophyIcon, description: "Leaderboard" },
];

export default function Sidebar({ active, onNavigate, user }: SidebarProps) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = user?.avatarColor ?? 'bg-[#7030E0]';

  const solvedCount = (() => {
    try {
      if (typeof window === 'undefined') return 0;
      const raw = localStorage.getItem('sf_solved');
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch { return 0; }
  })();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-gray-950 border-r border-gray-800 flex flex-col z-40 select-none">
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b border-gray-800 gap-1">
        <img src="/l.png" alt="Codeif" className="h-20 w-auto object-contain mix-blend-screen" />
        <span className="text-2xl font-bold text-[#F3F3F3]">Codeif</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        <p className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-3 font-semibold">Menu</p>
        {navItems.map(({ id, label, icon: Icon, description }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-150 ${
                isActive
                  ? "bg-[#7030E0]/10 text-[#7030E0] border border-[#7030E0]/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent"
              }`}
            >
              <span className={isActive ? "text-[#7030E0]" : "text-gray-500"}>
                <Icon />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">{label}</span>
                <span className={`text-xs leading-tight ${isActive ? "text-[#7030E0]/70" : "text-gray-600"}`}>
                  {description}
                </span>
              </div>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7030E0]" />}
            </button>
          );
        })}

        {/* Progress card */}
        <div className="mt-6 mx-1 bg-gray-900/70 border border-gray-800 rounded-xl p-3">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-2 font-semibold">Progress</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Questions solved</span>
            <span className="text-[#7030E0] font-bold text-sm">{solvedCount}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7030E0] to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (solvedCount / 50) * 100)}%` }}
            />
          </div>
          <p className="text-gray-700 text-xs mt-1">Goal: 50 questions</p>
        </div>
      </nav>

      {/* User profile at bottom */}
      <div className="px-3 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-default">
          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-1 ring-white/10`}>
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold leading-tight truncate">{user?.name || 'Engineer'}</div>
            <div className="text-gray-600 text-xs leading-tight truncate">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
