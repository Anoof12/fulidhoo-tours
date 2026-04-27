"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Row = { id: string; label: string };

export function BulkExcursionActions({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");

  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, checked]) => checked).map(([id]) => id),
    [selected],
  );

  async function apply(isActive: boolean) {
    if (!selectedIds.length) return;
    const res = await fetch("/api/admin/excursions/bulk-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, isActive }),
    });
    const body = (await res.json().catch(() => null)) as
      | { updated?: number; error?: string }
      | null;
    if (!res.ok) {
      setMessage(body?.error ?? "Bulk update failed");
      return;
    }
    setMessage(`${body?.updated ?? 0} excursions updated.`);
    setSelected({});
    router.refresh();
  }

  if (!rows.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-900">
        Bulk Actions ({selectedIds.length} selected)
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void apply(true)}
          className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
        >
          Activate Selected
        </button>
        <button
          type="button"
          onClick={() => void apply(false)}
          className="rounded bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
        >
          Set Inactive
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-slate-600">{message}</p> : null}
      <div className="mt-3 max-h-44 space-y-1 overflow-auto rounded bg-slate-50 p-2 text-xs">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rows.every((row) => selected[row.id])}
            onChange={(event) => {
              const checked = event.target.checked;
              const next: Record<string, boolean> = {};
              rows.forEach((row) => {
                next[row.id] = checked;
              });
              setSelected(next);
            }}
          />
          Select all on page
        </label>
        {rows.map((row) => (
          <label key={row.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(selected[row.id])}
              onChange={(event) =>
                setSelected((prev) => ({ ...prev, [row.id]: event.target.checked }))
              }
            />
            {row.label}
          </label>
        ))}
      </div>
    </div>
  );
}
