"use client";

import { useEffect } from "react";

const KEY = "recent_excursions";

export function ViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const existing: string[] = raw ? JSON.parse(raw) : [];
      const next = [slug, ...existing.filter((item) => item !== slug)].slice(0, 6);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore localStorage errors
    }
  }, [slug]);
  return null;
}
