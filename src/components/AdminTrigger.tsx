"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("./AdminPanel"), { ssr: false });

export default function AdminTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ctrl + Alt + A
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      // Escape closes
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return <AdminPanel onClose={() => setOpen(false)} />;
}
