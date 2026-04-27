"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DuplicateExcursionButton({ excursionId }: { excursionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDuplicate() {
    setLoading(true);
    const res = await fetch(`/api/admin/excursions/${excursionId}/duplicate`, {
      method: "POST",
    });
    setLoading(false);
    if (!res.ok) return;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void onDuplicate()}
      disabled={loading}
      className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
    >
      {loading ? "Duplicating..." : "Duplicate"}
    </button>
  );
}
