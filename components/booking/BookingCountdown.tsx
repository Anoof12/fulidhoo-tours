"use client";

import { useEffect, useState } from "react";

export function BookingCountdown({
  minutes = 15,
  label = "Hold timer",
}: {
  minutes?: number;
  label?: string;
}) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");
  const low = secondsLeft <= 5 * 60;

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm ${
        low ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <strong>{label}:</strong> {mins}:{secs}
    </div>
  );
}
