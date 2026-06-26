"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import StackSection from "@/components/dashboard/StackSection";
import RankSection from "@/components/dashboard/RankSection";

type Section = "stack" | "rank";

interface User {
  name: string;
  email: string;
  avatarColor?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>("stack");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sf_user");
      if (!raw) { router.replace("/login"); return; }
      setUser(JSON.parse(raw) as User);
    } catch {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready || !user) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-[#7030E0]/40 border-t-[#7030E0] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar active={section} onNavigate={setSection} user={user} />

      <div className="flex flex-col flex-1 ml-56 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Dashboard</span>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 font-medium capitalize">{section}</span>
          </div>
          <ProfileMenu name={user.name} email={user.email} avatarColor={user.avatarColor} />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {section === "stack" && <StackSection userName={user.name} />}
          {section === "rank" && <RankSection />}
        </main>
      </div>
    </div>
  );
}
