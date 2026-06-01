import type { Difficulty } from './questions';

export interface LeaderboardEntry {
  id: number;
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
  questionsSolved: number;
  totalTimeSeconds: number;
}

export function computeRank(entries: LeaderboardEntry[]): (LeaderboardEntry & { rank: number })[] {
  const sorted = [...entries].sort((a, b) => {
    if (b.questionsSolved !== a.questionsSolved) {
      return b.questionsSolved - a.questionsSolved;
    }
    return a.totalTimeSeconds - b.totalTimeSeconds;
  });
  return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

const LEADERBOARD_KEY = "sf_leaderboard";

function readLeaderboard(): Record<Difficulty, LeaderboardEntry[]> {
  if (typeof window === "undefined") return { easy: [], medium: [], extreme: [] };
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : { easy: [], medium: [], extreme: [] };
  } catch {
    return { easy: [], medium: [], extreme: [] };
  }
}

function writeLeaderboard(data: Record<Difficulty, LeaderboardEntry[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
}

export function getLeaderboard(): Record<Difficulty, (LeaderboardEntry & { rank: number })[]> {
  const data = readLeaderboard();
  return {
    easy: computeRank(data.easy),
    medium: computeRank(data.medium),
    extreme: computeRank(data.extreme),
  };
}

export function updateLeaderboard(userName: string, userEmail: string, difficulty: Difficulty, timeSeconds: number) {
  const data = readLeaderboard();
  const entries = data[difficulty];

  const existingIndex = entries.findIndex(e => e.email === userEmail);

  if (existingIndex >= 0) {
    entries[existingIndex].questionsSolved += 1;
    entries[existingIndex].totalTimeSeconds += timeSeconds;
  } else {
    const avatarColor = getAvatarColor(userName);
    entries.push({
      id: Date.now(),
      name: userName,
      email: userEmail,
      avatar: userName.charAt(0).toUpperCase(),
      avatarColor,
      questionsSolved: 1,
      totalTimeSeconds: timeSeconds,
    });
  }

  writeLeaderboard(data);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-[#7030E0]",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-indigo-500",
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[h % colors.length];
}

