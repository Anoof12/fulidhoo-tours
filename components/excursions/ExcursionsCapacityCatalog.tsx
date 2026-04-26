"use client";

import { useEffect, useMemo, useState } from "react";
import { Excursion } from "@/types/excursion";
import { ExcursionCard } from "@/components/cards/ExcursionCard";

type CapacityResponse = {
  maxCapacity: number;
  booked: number;
  available: number;
  percentage: number;
  status: "available" | "filling_up" | "almost_full" | "fully_booked";
};

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

export function ExcursionsCapacityCatalog() {
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [capacityMap, setCapacityMap] = useState<Record<string, CapacityResponse>>({});

  useEffect(() => {
    let mounted = true;
    const today = new Date().toISOString().slice(0, 10);

    async function load() {
      const excursionsResponse = await fetch("/api/excursions?limit=100");
      if (!excursionsResponse.ok) return;
      const payload = (await excursionsResponse.json()) as {
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
      if (!mounted) return;

      const mapped: Excursion[] = payload.data.map((item) => {
        const ratings = item.reviews?.map((review) => review.rating) ?? [];
        const rating = ratings.length
          ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10
          : 0;
        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          category: mapCategory(item.category),
          durationLabel: formatDuration(item.duration),
          maxCapacity: item.maxCapacity,
          pricePerPerson: Number(item.pricePerPerson),
          difficulty: mapDifficulty(item.difficulty),
          rating,
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
        };
      });
      setExcursions(mapped);

      const capacitiesResponse = await fetch(`/api/excursions/capacities?date=${today}`);
      if (!capacitiesResponse.ok) return;
      const capacitiesPayload = (await capacitiesResponse.json()) as {
        capacities: Array<CapacityResponse & { excursionId: string }>;
      };
      if (!mounted) return;

      const nextMap: Record<string, CapacityResponse> = {};
      capacitiesPayload.capacities.forEach((entry) => {
        nextMap[entry.excursionId] = {
          maxCapacity: entry.maxCapacity,
          booked: entry.booked,
          available: entry.available,
          percentage: entry.percentage,
          status: entry.status,
        };
      });
      setCapacityMap(nextMap);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const visible = useMemo(() => {
    if (!onlyAvailable) return excursions;
    return excursions.filter((excursion) => (capacityMap[excursion.id]?.available ?? 1) > 0);
  }, [capacityMap, onlyAvailable, excursions]);

  return (
    <div className="space-y-5">
      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(event) => setOnlyAvailable(event.target.checked)}
        />
        Show only available
      </label>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((excursion) => (
          <ExcursionCard
            key={excursion.id}
            excursion={excursion}
            booked={capacityMap[excursion.id]?.booked ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
