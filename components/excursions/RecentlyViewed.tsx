"use client";

import { useEffect, useState } from "react";
import { ExcursionCard } from "@/components/cards/ExcursionCard";
import { Excursion } from "@/types/excursion";

const KEY = "recent_excursions";

function mapCategory(category: string): Excursion["category"] {
  const map: Record<string, Excursion["category"]> = {
    SNORKELING: "Snorkeling",
    DIVING: "Diving",
    ISLAND_EXPERIENCE: "Island Experience",
    FISHING: "Fishing",
    WATER_SPORTS: "Water Sports",
    CULTURAL: "Cultural",
  };
  return map[category] ?? "Snorkeling";
}

function mapDifficulty(difficulty: string): Excursion["difficulty"] {
  const map: Record<string, Excursion["difficulty"]> = {
    EASY: "Easy",
    MODERATE: "Moderate",
    CHALLENGING: "Challenging",
  };
  return map[difficulty] ?? "Easy";
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60} hours`;
  return `${(minutes / 60).toFixed(1)} hours`;
}

export function RecentlyViewed() {
  const [items, setItems] = useState<Excursion[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const raw = localStorage.getItem(KEY);
      const slugs: string[] = raw ? JSON.parse(raw) : [];
      if (!slugs.length) return;

      const response = await fetch("/api/excursions?page=1&limit=24");
      if (!response.ok) return;
      const payload = (await response.json()) as {
        data: Array<{
          id: string;
          slug: string;
          title: string;
          description: string;
          shortDesc: string;
          category: string;
          duration: number;
          maxCapacity: number;
          pricePerPerson: string;
          difficulty: string;
          included: string[];
          excluded: string[];
          meetingPoint: string;
          images?: { url: string; isPrimary: boolean }[];
          reviews?: { rating: number }[];
        }>;
      };
      const bySlug = Object.fromEntries(payload.data.map((item) => [item.slug, item]));
      const mapped = slugs
        .map((slug) => bySlug[slug])
        .filter(Boolean)
        .slice(0, 3)
        .map((item) => {
          const ratings = item.reviews?.map((review) => review.rating) ?? [];
          return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            category: mapCategory(item.category),
            durationLabel: formatDuration(item.duration),
            maxCapacity: item.maxCapacity,
            pricePerPerson: Number(item.pricePerPerson),
            difficulty: mapDifficulty(item.difficulty),
            rating: ratings.length
              ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10
              : 0,
            reviewsCount: ratings.length,
            shortDescription: item.shortDesc,
            description: item.description,
            included: item.included,
            excluded: item.excluded,
            meetingPoint: item.meetingPoint,
            image:
              item.images?.find((image) => image.isPrimary)?.url ??
              item.images?.[0]?.url ??
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          } satisfies Excursion;
        });

      if (mounted) setItems(mapped);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
      <h2 className="mb-4 text-2xl font-bold text-slate-900">Recently Viewed</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((excursion) => (
          <ExcursionCard key={excursion.id} excursion={excursion} />
        ))}
      </div>
    </section>
  );
}
