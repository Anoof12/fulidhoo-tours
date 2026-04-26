"use client";

import { Share2 } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  async function handleShare() {
    const absoluteUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${window.location.origin}${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: absoluteUrl });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(absoluteUrl);
    alert("Link copied to clipboard.");
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
    >
      <Share2 size={14} />
      Share
    </button>
  );
}
