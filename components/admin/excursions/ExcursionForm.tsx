"use client";

import { ExcursionCategory, Difficulty } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type FormImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
  order: number;
};

type ExcursionFormValues = {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  category: ExcursionCategory;
  difficulty: Difficulty;
  pricePerPerson: number;
  groupDiscount: number | null;
  maxCapacity: number;
  minAge: number | null;
  duration: number;
  meetingPoint: string;
  included: string[];
  excluded: string[];
  blackoutDates: string[];
  isActive: boolean;
  images: FormImage[];
};

const categories: ExcursionCategory[] = [
  "SNORKELING",
  "DIVING",
  "ISLAND_EXPERIENCE",
  "FISHING",
  "WATER_SPORTS",
  "CULTURAL",
];
const difficulties: Difficulty[] = ["EASY", "MODERATE", "CHALLENGING"];

export function ExcursionForm({
  mode,
  initialValues,
  excursionId,
}: {
  mode: "create" | "edit";
  initialValues?: ExcursionFormValues;
  excursionId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ExcursionFormValues>(
    initialValues ?? {
      title: "",
      slug: "",
      shortDesc: "",
      description: "",
      category: "SNORKELING",
      difficulty: "EASY",
      pricePerPerson: 50,
      groupDiscount: null,
      maxCapacity: 8,
      minAge: null,
      duration: 120,
      meetingPoint: "Fulidhoo Jetty",
      included: [""],
      excluded: [""],
      blackoutDates: [],
      isActive: false,
      images: [],
    },
  );
  const [dateInput, setDateInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const durationLabel = useMemo(() => {
    const hours = Math.floor(form.duration / 60);
    const mins = form.duration % 60;
    return `${hours}h ${mins}m`;
  }, [form.duration]);

  function setField<K extends keyof ExcursionFormValues>(key: K, value: ExcursionFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const uploaded: FormImage[] = [];
    for (const file of Array.from(files).slice(0, 10 - form.images.length)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error ?? "Image upload failed");
        return;
      }
      uploaded.push({
        url: payload.url,
        altText: file.name.replace(/\.[^/.]+$/, ""),
        isPrimary: form.images.length + uploaded.length === 0,
        order: form.images.length + uploaded.length,
      });
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    const payload = {
      ...form,
      included: form.included.filter(Boolean),
      excluded: form.excluded.filter(Boolean),
      images: form.images.map((image, index) => ({ ...image, order: index })),
    };
    const endpoint = mode === "create" ? "/api/admin/excursions" : `/api/admin/excursions/${excursionId}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setError(body.error?.formErrors?.[0] ?? body.error ?? "Save failed");
      return;
    }
    router.push("/admin/excursions");
    router.refresh();
  }

  async function onDelete() {
    if (!excursionId || !confirm("Set this excursion as inactive?")) return;
    const res = await fetch(`/api/admin/excursions/${excursionId}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete excursion");
      return;
    }
    router.push("/admin/excursions");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-black/5 bg-white p-5">
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === "create" ? "Create Excursion" : "Edit Excursion"}
      </h1>
      {error ? <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Title" value={form.title} onChange={(e) => {
          const title = e.target.value;
          setField("title", title);
          if (mode === "create") setField("slug", slugify(title));
        }} required />
        <input className="rounded border p-2" placeholder="Slug" value={form.slug} onChange={(e) => setField("slug", slugify(e.target.value))} required />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Short description (20-150 chars)" value={form.shortDesc} onChange={(e) => setField("shortDesc", e.target.value)} required />
        <textarea className="rounded border p-2 md:col-span-2 min-h-32" placeholder="Full description" value={form.description} onChange={(e) => setField("description", e.target.value)} required />
        <select className="rounded border p-2" value={form.category} onChange={(e) => setField("category", e.target.value as ExcursionCategory)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="rounded border p-2" value={form.difficulty} onChange={(e) => setField("difficulty", e.target.value as Difficulty)}>
          {difficulties.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input className="rounded border p-2" type="number" min={1} value={form.pricePerPerson} onChange={(e) => setField("pricePerPerson", Number(e.target.value))} placeholder="Price per person" />
        <input className="rounded border p-2" type="number" min={1} value={form.maxCapacity} onChange={(e) => setField("maxCapacity", Number(e.target.value))} placeholder="Max capacity" />
        <input className="rounded border p-2" type="number" min={15} value={form.duration} onChange={(e) => setField("duration", Number(e.target.value))} placeholder="Duration in minutes" />
        <input className="rounded border p-2" value={form.meetingPoint} onChange={(e) => setField("meetingPoint", e.target.value)} placeholder="Meeting point" />
      </div>
      <p className="text-xs text-slate-600">Duration label: {durationLabel}</p>

      <ListEditor title="Included" items={form.included} onChange={(items) => setField("included", items)} />
      <ListEditor title="Excluded" items={form.excluded} onChange={(items) => setField("excluded", items)} />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Images (max 10)</p>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => void uploadFiles(e.target.files)} />
        <div className="space-y-2">
          {form.images.map((image, index) => (
            <div key={image.url + index} className="rounded border p-2">
              <p className="text-xs text-slate-500 break-all">{image.url}</p>
              <input className="mt-1 w-full rounded border p-1 text-sm" value={image.altText} onChange={(e) => {
                const next = [...form.images];
                next[index] = { ...next[index], altText: e.target.value };
                setField("images", next);
              }} placeholder="Alt text" />
              <div className="mt-2 flex gap-3 text-xs">
                <label className="flex items-center gap-1">
                  <input type="radio" name="primary-image" checked={image.isPrimary} onChange={() => {
                    setField("images", form.images.map((img, i) => ({ ...img, isPrimary: i === index })));
                  }} />
                  Primary
                </label>
                <button type="button" className="text-red-600" onClick={() => {
                  const next = form.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i, isPrimary: i === 0 ? true : img.isPrimary }));
                  setField("images", next.length && !next.some((img) => img.isPrimary) ? next.map((img, i) => ({ ...img, isPrimary: i === 0 })) : next);
                }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Blackout Dates</p>
        <div className="flex gap-2">
          <input type="date" className="rounded border p-2 text-sm" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          <button type="button" className="rounded bg-slate-700 px-3 py-2 text-xs font-semibold text-white" onClick={() => {
            if (!dateInput || form.blackoutDates.includes(dateInput)) return;
            setField("blackoutDates", [...form.blackoutDates, dateInput].sort());
            setDateInput("");
          }}>Add Date</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.blackoutDates.map((date) => (
            <button key={date} type="button" onClick={() => setField("blackoutDates", form.blackoutDates.filter((d) => d !== date))} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
              {date} x
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} />
        Publish immediately (active)
      </label>

      <div className="flex gap-2">
        <button className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white" disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : mode === "create" ? "Create Excursion" : "Update Excursion"}
        </button>
        {mode === "edit" ? (
          <button type="button" onClick={onDelete} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">
            Set Inactive
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{title}</p>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="flex gap-2">
          <input
            className="w-full rounded border p-2 text-sm"
            value={item}
            onChange={(e) => onChange(items.map((existing, i) => (i === index ? e.target.value : existing)))}
          />
          <button
            type="button"
            className="rounded border px-3 text-xs"
            onClick={() => onChange(items.length === 1 ? [""] : items.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="rounded border px-3 py-1 text-xs">
        Add {title} item
      </button>
    </div>
  );
}
