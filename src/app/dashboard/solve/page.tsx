"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  easyQuestions,
  mediumQuestions,
  extremeQuestions,
  type Question,
} from "@/data/questions";
import { getQuestionDetails } from "@/data/questionDetails";
import CodeWorkspace from "@/components/dashboard/CodeWorkspace";
import Link from "next/link";

const allQuestions: Question[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...extremeQuestions,
];

// ── Loading skeleton while Suspense resolves ─────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="h-screen bg-[#0d0d0d] flex flex-col overflow-hidden">
      {/* Top bar skeleton */}
      <div className="h-14 border-b border-gray-800 bg-gray-950 flex items-center px-4 gap-3 shrink-0">
        <div className="w-16 h-6 bg-gray-800 rounded animate-pulse" />
        <div className="w-px h-6 bg-gray-800" />
        <div className="w-48 h-5 bg-gray-800 rounded animate-pulse" />
        <div className="ml-auto flex gap-2">
          <div className="w-28 h-8 bg-gray-800 rounded-lg animate-pulse" />
          <div className="w-20 h-8 bg-gray-800 rounded-lg animate-pulse" />
          <div className="w-20 h-8 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
      {/* Body skeleton */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[38%] border-r border-gray-800 bg-[#111] p-6 space-y-4">
          <div className="w-3/4 h-6 bg-gray-800 rounded animate-pulse" />
          <div className="w-1/3 h-4 bg-gray-800 rounded animate-pulse" />
          <div className="space-y-2 pt-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-3 bg-gray-800 rounded animate-pulse"
                style={{ width: `${75 + Math.random() * 25}%` }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#1e1e1e] flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="w-4 h-4 border-2 border-gray-600 border-t-[#7030E0] rounded-full animate-spin" />
            Loading workspace…
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inner component that reads search params ──────────────────────────────────
function SolveContent() {
  const searchParams = useSearchParams();
  const idStr = searchParams.get("id");
  const id = idStr ? parseInt(idStr, 10) : null;

  if (!id || isNaN(id)) {
    return (
      <div className="h-screen bg-[#0d0d0d] flex items-center justify-center text-white flex-col gap-4">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-gray-400 text-sm">No question selected.</p>
        <Link
          href="/dashboard"
          className="text-[#7030E0] hover:text-[#8B4CFF] text-sm transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const question = allQuestions.find((q) => q.id === id);
  const details = getQuestionDetails(id);

  if (!question || !details) {
    return (
      <div className="h-screen bg-[#0d0d0d] flex items-center justify-center text-white flex-col gap-4">
        <p className="text-gray-500 text-sm">Question #{id} not found.</p>
        <Link
          href="/dashboard"
          className="text-[#7030E0] hover:text-[#8B4CFF] text-sm transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return <CodeWorkspace question={question} details={details} />;
}

// ── Page export — wraps with Suspense (required for useSearchParams) ───────────
export default function SolvePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SolveContent />
    </Suspense>
  );
}
