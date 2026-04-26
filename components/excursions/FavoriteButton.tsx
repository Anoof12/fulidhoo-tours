"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function FavoriteButton({ excursionId }: { excursionId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const res = await fetch("/api/favorites");
      if (!res.ok) {
        if (mounted) setLoading(false);
        return;
      }
      const body = (await res.json()) as { data: { excursionId: string }[] };
      if (mounted) {
        setIsFavorite(body.data.some((f) => f.excursionId === excursionId));
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [excursionId]);

  async function toggle() {
    if (loading) return;
    if (isFavorite) {
      const res = await fetch(`/api/favorites?excursionId=${encodeURIComponent(excursionId)}`, {
        method: "DELETE",
      });
      if (res.ok) setIsFavorite(false);
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ excursionId }),
    });
    if (res.status === 401) {
      window.location.href = `/login?redirect=${encodeURIComponent("/excursions")}`;
      return;
    }
    if (res.ok) setIsFavorite(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={14} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500"} />
      {isFavorite ? "Saved" : "Save"}
    </button>
  );
}
