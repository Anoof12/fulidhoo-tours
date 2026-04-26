"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ToggleExcursionActiveButtonProps = {
  excursionId: string;
  isActive: boolean;
};

export function ToggleExcursionActiveButton({
  excursionId,
  isActive,
}: ToggleExcursionActiveButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setIsSaving(true);
    setError("");
    const response = await fetch(`/api/admin/excursions/${excursionId}/toggle-active`, {
      method: "PATCH",
    });
    setIsSaving(false);

    if (!response.ok) {
      setError("Update failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        className={`rounded-md px-2 py-1 text-xs font-semibold text-white disabled:opacity-60 ${
          isActive ? "bg-amber-600" : "bg-emerald-600"
        }`}
      >
        {isSaving ? "Saving..." : isActive ? "Set Inactive" : "Set Active"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
