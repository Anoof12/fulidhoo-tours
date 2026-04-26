"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CapacityBar } from "@/components/excursions/CapacityBar";
import { useCartStore } from "@/store/cartStore";

type BookingWidgetProps = {
  excursionId: string;
  title: string;
  pricePerPerson: number;
  maxCapacity: number;
};

type CapacityData = {
  maxCapacity: number;
  booked: number;
  available: number;
  percentage: number;
  status: "available" | "filling_up" | "almost_full" | "fully_booked";
};

export function BookingWidget({ excursionId, title, pricePerPerson, maxCapacity }: BookingWidgetProps) {
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(1);
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [liveNotice, setLiveNotice] = useState("");
  const [screenReaderNotice, setScreenReaderNotice] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const addToCart = useCartStore((state) => state.addToCart);

  const activeDate = useMemo(() => date || new Date().toISOString().slice(0, 10), [date]);

  useEffect(() => {
    let mounted = true;
    let prevAvailable: number | null = null;

    async function fetchCapacity() {
      const response = await fetch(
        `/api/excursions/${excursionId}/capacity?date=${encodeURIComponent(activeDate)}`,
      );
      if (!response.ok) return;
      const data = (await response.json()) as CapacityData;
      if (!mounted) return;

      if (prevAvailable !== null && data.available < prevAvailable) {
        const diff = prevAvailable - data.available;
        const message = `${diff} people just booked. Only ${data.available} spots left!`;
        setLiveNotice(message);
        setScreenReaderNotice(message);
      }

      prevAvailable = data.available;
      setCapacity(data);
    }

    fetchCapacity();
    const intervalId = setInterval(fetchCapacity, 30000);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [activeDate, excursionId]);

  const capacityMax = capacity?.maxCapacity ?? maxCapacity;
  const capacityBooked = capacity?.booked ?? 0;
  const capacityAvailable = Math.max(0, capacityMax - capacityBooked);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/5 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          {capacityAvailable} of {capacityMax} spots available
        </p>
        <div className="mt-2">
          <CapacityBar current={capacityBooked} max={capacityMax} variant="bar" />
        </div>
      </div>
      {liveNotice ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {liveNotice}
        </p>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {screenReaderNotice}
      </p>

      <label className="block text-sm font-medium text-slate-700">
        Date
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="input-base mt-1"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Participants
        <input
          type="number"
          min={1}
          max={Math.max(1, capacityAvailable)}
          value={participants}
          onChange={(event) => setParticipants(Number(event.target.value))}
          className="input-base mt-1"
        />
      </label>
      <button
        type="button"
        disabled={!date || participants > capacityAvailable || capacityAvailable <= 0}
        onClick={() => {
          addToCart({
            excursionId,
            title,
            date,
            participants,
            pricePerPerson,
          });
          setBookingMessage("Added to cart. Go to checkout to complete your reservation.");
        }}
        className="btn-primary w-full py-3 font-bold"
      >
        {capacityAvailable <= 0 ? "Fully Booked" : "Add to Cart"}
      </button>
      {bookingMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <p>{bookingMessage}</p>
          <Link href="/checkout" className="mt-2 inline-block font-semibold text-emerald-700 underline">
            Continue to checkout
          </Link>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          This button adds your selection to cart. Final reservation is completed on the checkout page.
        </p>
      )}
    </div>
  );
}
