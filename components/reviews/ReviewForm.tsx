"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewForm({ excursionId }: { excursionId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ excursionId, rating, comment }),
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(body.error ?? "Failed to submit review");
      return;
    }
    setMessage("Review submitted. Thank you!");
    setComment("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-2 rounded-lg border border-slate-200 p-3">
      <p className="text-sm font-semibold text-slate-900">Write a review</p>
      <select
        value={rating}
        onChange={(event) => setRating(Number(event.target.value))}
        className="rounded border p-2 text-sm"
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} star{value > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="w-full rounded border p-2 text-sm"
        placeholder="Share your experience"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
      {message ? <p className="text-xs text-slate-700">{message}</p> : null}
    </form>
  );
}
