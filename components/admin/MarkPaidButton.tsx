"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MarkPaidButtonProps = {
  bookingId: string;
};

export function MarkPaidButton({ bookingId }: MarkPaidButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMarkPaid() {
    setError("");
    setIsLoading(true);
    const response = await fetch(`/api/admin/bookings/${bookingId}/mark-paid`, {
      method: "PATCH",
    });
    setIsLoading(false);

    if (!response.ok) {
      setError("Failed to update payment status.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={isLoading}
        onClick={handleMarkPaid}
        className="min-h-10 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {isLoading ? "Updating..." : "Mark as Paid On Site"}
      </button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
