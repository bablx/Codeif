"use client";

import type { FC } from "react";

type Section = "stack" | "rank";

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}

const StackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <rect x="2" y="10" width="20" height="5" rx="1" />
    <rect x="2" y="17" width="20" height="5" rx="1" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h2" />
    <path d="M18 9h2a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1h-2" />
    <path d="M4 22h16" />
    <path d="M10 22v-4" />
    <path d="M14 22v-4" />
    <path d="M8 4h8v8a4 4 0 0 1-4 4 4 4 0 0 1-4-4Z" />
  </svg>
);

const navItems: {
  id: Section;
  label: string;
  icon: FC;
  description: string;
}[] = [
  {
    id: "stack",
    label: "Stack",
    icon: StackIcon,
    description: "1000+ Questions",
  },
  {
    id: "rank",
    label: "Rank",
    icon: TrophyIcon,
    description: "Leaderboard",
  },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-gray-950 border-r border-gray-800 flex flex-col z-40 select-none">
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b border-gray-800 gap-1">
        <img
          src="/l.png"
          alt="Codeif"
          className="h-20 w-auto object-contain mix-blend-screen"
        />
        <span className="text-2xl font-bold text-[#F3F3F3]">
          Codeif
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        <p className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-3 font-semibold">
          Menu
        </p>
        {navItems.map(({ id, label, icon: Icon, description }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-150
                ${
                  isActive
                    ? "bg-[#7030E0]/10 text-[#7030E0] border border-[#7030E0]/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent"
                }
              `}
            >
              <span className={isActive ? "text-[#7030E0]" : "text-gray-500"}>
                <Icon />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">
                  {label}
                </span>
                <span
                  className={`text-xs leading-tight ${isActive ? "text-[#7030E0]/70" : "text-gray-600"}`}
                >
                  {description}
                </span>
              </div>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7030E0]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom hint */}
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-gray-700 text-xs leading-snug">
          Codeif &copy; 2025
        </p>
      </div>
    </aside>
  );
}
