"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme_mode";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
    return;
  }
  root.classList.toggle("dark", mode === "dark");
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const nextMode: ThemeMode =
      saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    applyTheme(nextMode);
    if (nextMode !== mode) {
      queueMicrotask(() => setMode(nextMode));
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if ((localStorage.getItem(STORAGE_KEY) as ThemeMode | null) === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [mode]);

  function updateMode(nextMode: ThemeMode) {
    setMode(nextMode);
    localStorage.setItem(STORAGE_KEY, nextMode);
    applyTheme(nextMode);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-white/70 p-1 shadow-sm">
      <button
        type="button"
        onClick={() => updateMode("light")}
        className={`rounded-full p-1.5 transition ${mode === "light" ? "bg-slate-200" : "hover:bg-slate-100"}`}
        aria-label="Light mode"
      >
        <Sun size={14} />
      </button>
      <button
        type="button"
        onClick={() => updateMode("dark")}
        className={`rounded-full p-1.5 transition ${mode === "dark" ? "bg-slate-200" : "hover:bg-slate-100"}`}
        aria-label="Dark mode"
      >
        <Moon size={14} />
      </button>
      <button
        type="button"
        onClick={() => updateMode("system")}
        className={`rounded-full p-1.5 transition ${mode === "system" ? "bg-slate-200" : "hover:bg-slate-100"}`}
        aria-label="System theme"
      >
        <Monitor size={14} />
      </button>
    </div>
  );
}
