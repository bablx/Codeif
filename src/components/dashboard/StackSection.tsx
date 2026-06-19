"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  questionsByDifficulty,
  TOTAL_COUNTS,
  type Difficulty,
  type Question,
} from "@/data/questions";

const PAGE_SIZE = 15;

const difficultyConfig: Record<
  Difficulty,
  { label: string; color: string; badge: string; total: number }
> = {
  easy: {
    label: "Easy",
    color: "text-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    total: TOTAL_COUNTS.easy,
  },
  medium: {
    label: "Medium",
    color: "text-amber-400",
    badge: "bg-amber-400/10   text-amber-400   border-amber-400/20",
    total: TOTAL_COUNTS.medium,
  },
  extreme: {
    label: "Extreme",
    color: "text-rose-400",
    badge: "bg-rose-400/10    text-rose-400    border-rose-400/20",
    total: TOTAL_COUNTS.extreme,
  },
};

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const cfg = difficultyConfig[difficulty];
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${cfg.badge}`}
    >
      {cfg.label}
    </span>
  );
}

function QuestionRow({ q, index, isSolved }: { q: Question; index: number; isSolved: boolean }) {
  return (
    <Link
      href={`/dashboard/solve?id=${q.id}`}
      className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors group cursor-pointer"
    >
      {/* Number */}
      <span className={`text-sm w-8 shrink-0 font-mono ${isSolved ? "text-emerald-500" : "text-gray-600"}`}>
        {isSolved
          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          : String(index + 1).padStart(2, "0")}
      </span>

      {/* Title + tags */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium transition-colors ${isSolved ? "text-emerald-400/80 group-hover:text-emerald-300" : "text-gray-100 group-hover:text-[#7030E0]"}`}>
          {q.title}
        </span>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {q.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Topic */}
      <span className="text-gray-500 text-xs hidden md:block w-36 shrink-0 truncate">{q.topic}</span>

      {/* Acceptance */}
      <div className="hidden lg:flex items-center gap-2 w-24 shrink-0">
        <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-[#7030E0]/60 rounded-full" style={{ width: `${q.acceptance}%` }} />
        </div>
        <span className="text-gray-500 text-xs w-8 text-right">{q.acceptance}%</span>
      </div>

      {/* Solve CTA */}
      <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
        isSolved
          ? "border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/10"
          : "border-[#7030E0]/30 text-[#7030E0] group-hover:bg-[#7030E0]/10"
      }`}>
        {isSolved ? "Review →" : "Solve →"}
      </span>
    </Link>
  );
}

function useSolved() {
  const [solved, setSolved] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sf_solved");
      if (raw) setSolved(new Set(JSON.parse(raw) as string[]));
    } catch { /* ignore */ }
  }, []);

  const markSolved = (id: string) => {
    setSolved((prev) => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem("sf_solved", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  return { solved, markSolved };
}

export default function StackSection({ userName }: { userName?: string }) {
  const [active, setActive] = useState<Difficulty>("easy");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { solved } = useSolved();

  const easySolved = [...solved].filter((id) => questionsByDifficulty.easy.some((q) => q.id === id)).length;
  const mediumSolved = [...solved].filter((id) => questionsByDifficulty.medium.some((q) => q.id === id)).length;
  const extremeSolved = [...solved].filter((id) => questionsByDifficulty.extreme.some((q) => q.id === id)).length;
  const totalSolved = solved.size;

  const allForDifficulty = questionsByDifficulty[active];

  const filtered = search.trim()
    ? allForDifficulty.filter(
        (q) =>
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.topic.toLowerCase().includes(search.toLowerCase()) ||
          q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      )
    : allForDifficulty;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(0, page * PAGE_SIZE);

  function handleTabChange(diff: Difficulty) {
    setActive(diff);
    setPage(1);
    setSearch("");
  }

  return (
    <div className="flex flex-col">
      {/* Welcome banner */}
      <div className="mb-6 bg-gradient-to-r from-[#7030E0]/20 via-[#7030E0]/5 to-transparent border border-[#7030E0]/20 rounded-2xl px-6 py-5">
        <h2 className="text-2xl font-bold text-white">
          {userName ? `Welcome back, ${userName.split(" ")[0]} 👋` : "Practice Stack"}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          1,050+ questions across all difficulty levels. Pick your challenge.
        </p>
      </div>

      {/* Progress stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Solved", value: totalSolved, color: "text-[#7030E0]", bg: "from-[#7030E0]/10", border: "border-[#7030E0]/20" },
          { label: "Easy", value: easySolved, color: "text-emerald-400", bg: "from-emerald-400/10", border: "border-emerald-400/20" },
          { label: "Medium", value: mediumSolved, color: "text-amber-400", bg: "from-amber-400/10", border: "border-amber-400/20" },
          { label: "Extreme", value: extremeSolved, color: "text-rose-400", bg: "from-rose-400/10", border: "border-rose-400/20" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} to-transparent border ${stat.border} rounded-xl px-4 py-4`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        {/* Difficulty tabs */}
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => {
            const cfg = difficultyConfig[diff];
            const isActive = active === diff;
            return (
              <button
                key={diff}
                onClick={() => handleTabChange(diff)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? `bg-gray-800 ${cfg.color} shadow`
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {cfg.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${isActive ? cfg.badge : "bg-gray-800 text-gray-600"} border`}
                >
                  {cfg.total}+
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#7030E0]/50 transition-colors"
          />
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-t-lg">
        <span className="text-gray-600 text-xs uppercase tracking-wider w-8 shrink-0">
          #
        </span>
        <span className="text-gray-600 text-xs uppercase tracking-wider flex-1">
          Title
        </span>
        <span className="text-gray-600 text-xs uppercase tracking-wider hidden md:block w-36 shrink-0">
          Topic
        </span>
        <span className="text-gray-600 text-xs uppercase tracking-wider hidden lg:block w-24 shrink-0">
          Acceptance
        </span>
        <span className="text-gray-600 text-xs uppercase tracking-wider w-14 shrink-0"></span>
      </div>

      {/* Questions list */}
      <div className="bg-gray-900/30 border border-t-0 border-gray-800 rounded-b-lg">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <svg
              className="mx-auto mb-3 opacity-30"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            No questions match your search.
          </div>
        ) : (
          visible.map((q, i) => <QuestionRow key={q.id} q={q} index={i} isSolved={solved.has(q.id)} />)
        )}
      </div>

      {/* Load more / pagination */}
      {!search && page < totalPages && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-[#7030E0] border border-[#7030E0]/30 px-6 py-2 rounded-lg hover:bg-[#7030E0]/10 transition-colors"
          >
            Load more &darr;
          </button>
        </div>
      )}

      {/* Count footer */}
      <p className="text-xs text-gray-700 mt-3 text-center">
        Showing {visible.length} of {filtered.length} loaded &mdash;{" "}
        {difficultyConfig[active].total}+ total in this category
      </p>
    </div>
  );
}
