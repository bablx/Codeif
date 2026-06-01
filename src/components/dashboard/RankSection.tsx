"use client";

import { useState } from "react";
import { getLeaderboard, formatTime } from "@/data/leaderboard";
import type { Difficulty } from "@/data/questions";

const tabs: {
  id: Difficulty;
  label: string;
  color: string;
  activeBg: string;
}[] = [
  {
    id: "easy",
    label: "Easy",
    color: "text-emerald-400",
    activeBg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    id: "medium",
    label: "Medium",
    color: "text-amber-400",
    activeBg: "bg-amber-400/10   border-amber-400/20",
  },
  {
    id: "extreme",
    label: "Extreme",
    color: "text-rose-400",
    activeBg: "bg-rose-400/10    border-rose-400/20",
  },
];

const MEDAL: Record<number, { emoji: string; ring: string }> = {
  1: { emoji: "🥇", ring: "ring-2 ring-yellow-400/40" },
  2: { emoji: "🥈", ring: "ring-2 ring-gray-400/40" },
  3: { emoji: "🥉", ring: "ring-2 ring-amber-600/40" },
};

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return <span className="text-xl leading-none">{MEDAL[rank].emoji}</span>;
  }
  return (
    <span className="text-sm font-bold text-gray-500 w-6 text-center">
      #{rank}
    </span>
  );
}

export default function RankSection() {
  const [active, setActive] = useState<Difficulty>("easy");

  const leaderboardData = getLeaderboard();
  const entries = leaderboardData[active];
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        <p className="text-gray-500 text-sm mt-1">
          Ranked by most questions solved &mdash; ties broken by shortest total
          time.
        </p>
      </div>

      {/* Scoring explanation card */}
      <div className="mb-5 bg-gray-900/50 border border-gray-800 rounded-xl px-5 py-4 flex flex-wrap gap-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7030E0]/10 border border-[#7030E0]/20 flex items-center justify-center text-[#7030E0] shrink-0 mt-0.5">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">
              Questions Solved
            </div>
            <div className="text-gray-500 text-xs mt-0.5">
              More solved = higher rank. Primary criterion.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Total Time</div>
            <div className="text-gray-500 text-xs mt-0.5">
              On tied questions, fastest total time wins.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 4h8v8a4 4 0 0 1-4 4 4 4 0 0 1-4-4Z" />
              <path d="M4 22h16" />
              <path d="M10 22v-4" />
              <path d="M14 22v-4" />
            </svg>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">
              Separate Categories
            </div>
            <div className="text-gray-500 text-xs mt-0.5">
              Easy, Medium, and Extreme have independent boards.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit mb-5">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-150 border ${
                isActive
                  ? `${t.color} ${t.activeBg}`
                  : "text-gray-500 hover:text-gray-300 border-transparent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {entries.slice(0, 3).map((entry) => {
          const medal = MEDAL[entry.rank];
          return (
            <div
              key={entry.id}
              className={`bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-5 flex flex-col items-center gap-2 ${
                entry.rank === 1 ? "border-yellow-400/30 bg-yellow-400/5" : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full ${entry.avatarColor} flex items-center justify-center text-white font-bold text-lg ${medal.ring}`}
              >
                {entry.avatar}
              </div>
              <span className="text-xl">{medal.emoji}</span>
              <span className="text-white font-semibold text-sm">
                {entry.name}
              </span>
              <div className="text-center">
                <div className={`text-lg font-bold ${tab.color}`}>
                  {entry.questionsSolved}
                </div>
                <div className="text-gray-600 text-xs">questions</div>
              </div>
              <div className="text-gray-500 text-xs">
                {formatTime(entry.totalTimeSeconds)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table header */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-t-lg">
        <span className="text-gray-600 text-xs uppercase tracking-wider w-8 shrink-0">
          Rank
        </span>
        <span className="text-gray-600 text-xs uppercase tracking-wider flex-1">
          Competitor
        </span>
        <span
          className={`text-xs uppercase tracking-wider font-semibold w-28 shrink-0 text-right ${tab.color}`}
        >
          Solved
        </span>
        <span className="text-gray-600 text-xs uppercase tracking-wider w-24 shrink-0 text-right">
          Time
        </span>
      </div>

      {/* Full table */}
      <div className="bg-gray-900/30 border border-t-0 border-gray-800 rounded-b-lg overflow-hidden">
        {entries.map((entry) => {
          const isMedal = entry.rank <= 3;
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-4 px-4 py-3.5 border-b border-gray-800/60 last:border-0 transition-colors ${
                isMedal ? "hover:bg-gray-800/30" : "hover:bg-gray-800/20"
              }`}
            >
              {/* Rank */}
              <div className="w-8 shrink-0 flex items-center justify-center">
                <RankBadge rank={entry.rank} />
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full ${entry.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0 ${isMedal ? (MEDAL[entry.rank]?.ring ?? "") : ""}`}
                >
                  {entry.avatar}
                </div>
                <span className="text-gray-200 text-sm font-medium truncate">
                  {entry.name}
                </span>
              </div>

              {/* Solved count + mini bar */}
              <div className="w-28 shrink-0 flex items-center gap-2 justify-end">
                <div className="w-16 bg-gray-800 rounded-full h-1.5 hidden sm:block overflow-hidden">
                  <div
                    className={`h-full rounded-full ${active === "easy" ? "bg-emerald-500/70" : active === "medium" ? "bg-amber-500/70" : "bg-rose-500/70"}`}
                    style={{
                      width: `${Math.min(100, (entry.questionsSolved / entries[0].questionsSolved) * 100)}%`,
                    }}
                  />
                </div>
                <span className={`text-sm font-bold ${tab.color}`}>
                  {entry.questionsSolved}
                </span>
              </div>

              {/* Time */}
              <span className="text-gray-500 text-sm w-24 shrink-0 text-right">
                {formatTime(entry.totalTimeSeconds)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-700 mt-3 text-center">
        Rankings update in real-time as questions are submitted.
      </p>
    </div>
  );
}
