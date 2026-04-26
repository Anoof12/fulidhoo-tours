"use client";

import { BookingStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingStatusControlProps = {
  bookingId: string;
  currentStatus: BookingStatus;
};

const options: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export function BookingStatusControl({ bookingId, currentStatus }: BookingStatusControlProps) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate() {
    setIsSaving(true);
    setError("");
    const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setIsSaving(false);

    if (!response.ok) {
      setError("Failed to update status.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as BookingStatus)}
        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleUpdate}
        disabled={isSaving}
        className="rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-white disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Update"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
