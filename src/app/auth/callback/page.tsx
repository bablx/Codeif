"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthCallback() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      const user = {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        avatarColor:
          (session.user as any).avatarColor ?? "bg-[#7030E0]",
      };
      localStorage.setItem("sf_user", JSON.stringify(user));
      window.location.replace("/dashboard");
    } else if (status === "unauthenticated") {
      window.location.replace("/login");
    }
  }, [status, session]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-[#7030E0]/40 border-t-[#7030E0] rounded-full animate-spin" />
    </div>
  );
}
