"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("./AdminPanel"), { ssr: false });

export default function AdminTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
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
