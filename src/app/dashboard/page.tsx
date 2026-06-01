"use client";

import { useSyncExternalStore, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import StackSection from "@/components/dashboard/StackSection";
import RankSection from "@/components/dashboard/RankSection";

type Section = "stack" | "rank";

interface User {
  name: string;
  email: string;
}

const EMPTY_USER: User = { name: "", email: "" };

// Module-level cache — readStoredUser must return the SAME object reference
// on every call (required by useSyncExternalStore to avoid infinite loops).
let _cachedUser: User | null = null;

function readStoredUser(): User {
  if (_cachedUser !== null) return _cachedUser; // stable reference
  try {
    const raw = localStorage.getItem("sf_user");
    if (raw) {
      _cachedUser = JSON.parse(raw) as User;
      return _cachedUser;
    }
  } catch {
    /* ignore */
  }
  // Fallback: URL params
  try {
    const p = new URLSearchParams(window.location.search);
    const name = p.get("name") ?? "";
    const email = p.get("email") ?? "";
    if (name || email) {
      _cachedUser = { name, email };
      return _cachedUser;
    }
  } catch {
    /* ignore */
  }
  _cachedUser = EMPTY_USER;
  return _cachedUser;
}

export default function Dashboard() {
  // useSyncExternalStore:
  //   server snapshot → always EMPTY_USER (prevents hydration mismatch)
  //   client snapshot → cached localStorage value (stable ref = no infinite loop)
  const user = useSyncExternalStore(
    () => () => {}, // no-op subscribe
    readStoredUser, // client snapshot (cached, stable reference)
    () => EMPTY_USER, // server snapshot
  );

  const [section, setSection] = useState<Section>("stack");

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <Sidebar active={section} onNavigate={setSection} />

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 ml-56 min-w-0">
        {/* ── Top bar ── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Dashboard</span>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 font-medium capitalize">
              {section}
            </span>
          </div>

          {/* Profile — top right */}
          <ProfileMenu name={user.name} email={user.email} />
        </header>

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {section === "stack" && <StackSection />}
          {section === "rank" && <RankSection />}
        </main>
      </div>
    </div>
  );
}
