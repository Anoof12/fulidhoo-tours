"use client";

import { CloudSun, Waves, Wind } from "lucide-react";
import { useEffect, useState } from "react";

type SeaConditionHintProps = {
  category: string;
};

type MarineSnapshot = {
  waveHeight?: number;
  windSpeed?: number;
  seaTemp?: number;
};

function categoryAdvice(category: string): string {
  switch (category) {
    case "Snorkeling":
    case "Diving":
      return "🤿 Best when waves are calm and visibility is good.";
    case "Fishing":
      return "🎣 Slight breeze can be great, but very strong wind reduces comfort.";
    case "Island Experience":
    case "Cultural":
      return "🏝️ Usually weather-flexible, but calmer seas make transfers smoother.";
    default:
      return "🌤️ Check local conditions before departure for the smoothest trip.";
  }
}

async function getMarineSnapshot(): Promise<MarineSnapshot | null> {
  try {
    // Fulidhoo approximate coordinates.
    const url =
      "https://marine-api.open-meteo.com/v1/marine?latitude=3.687&longitude=73.410&hourly=wave_height&timezone=auto";
    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=3.687&longitude=73.410&hourly=windspeed_10m,temperature_2m&timezone=auto";

    const [marineRes, weatherRes] = await Promise.all([
      fetch(url, { cache: "no-store" }),
      fetch(weatherUrl, { cache: "no-store" }),
    ]);
    if (!marineRes.ok || !weatherRes.ok) return null;

    const marineData = (await marineRes.json()) as {
      hourly?: { wave_height?: number[] };
    };
    const weatherData = (await weatherRes.json()) as {
      hourly?: { windspeed_10m?: number[]; temperature_2m?: number[] };
    };

    const waveHeight = marineData.hourly?.wave_height?.[0];
    const windSpeed = weatherData.hourly?.windspeed_10m?.[0];
    const seaTemp = weatherData.hourly?.temperature_2m?.[0];

    return { waveHeight, windSpeed, seaTemp };
  } catch {
    return null;
  }
}

export function SeaConditionHint({ category }: SeaConditionHintProps) {
  const [snapshot, setSnapshot] = useState<MarineSnapshot | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMarineSnapshot()
      .then((data) => {
        if (!mounted) return;
        setSnapshot(data);
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const waveLabel =
    snapshot?.waveHeight !== undefined
      ? snapshot.waveHeight <= 0.6
        ? "🟢 Calm sea"
        : snapshot.waveHeight <= 1.2
          ? "🟡 Moderate chop"
          : "🔴 Rough sea"
      : loaded
        ? "⚪ Sea data unavailable"
        : "⏳ Fetching sea data...";

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Conditions Hint</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{categoryAdvice(category)}</p>
      <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-3">
        <p className="inline-flex items-center gap-1.5">
          <Waves className="h-4 w-4 text-sky-600" aria-hidden />
          {waveLabel}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <Wind className="h-4 w-4 text-sky-600" aria-hidden />
          {snapshot?.windSpeed !== undefined ? `${snapshot.windSpeed.toFixed(1)} km/h wind` : "Wind n/a"}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <CloudSun className="h-4 w-4 text-sky-600" aria-hidden />
          {snapshot?.seaTemp !== undefined ? `${snapshot.seaTemp.toFixed(1)}°C air` : "Temp n/a"}
        </p>
      </div>
    </div>
  );
}
