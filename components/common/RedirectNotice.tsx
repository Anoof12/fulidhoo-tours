"use client";

import { useState } from "react";

type RedirectNoticeProps = {
  text: string;
};

export function RedirectNotice({ text }: RedirectNoticeProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>{text}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="rounded-md px-2 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        Dismiss
      </button>
    </div>
  );
}
