"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const total = items.reduce((sum, item) => sum + item.participants * item.pricePerPerson, 0);

  async function handleReserve() {
    setMessage("");
    if (!items.length) return;

    setIsSubmitting(true);
    const response = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerEmail,
        customerPhone,
        specialRequests: specialRequests || undefined,
        items: items.map((item) => ({
          excursionId: item.excursionId,
          date: item.date,
          participants: item.participants,
          totalPrice: item.participants * item.pricePerPerson,
        })),
      }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    setIsSubmitting(false);
    if (!response.ok) {
      setMessageType("error");
      setMessage(payload?.error ?? "Could not reserve booking. Please check details and try again.");
      return;
    }

    clearCart();
    setMessageType("success");
    setMessage("Booking reserved successfully. Payment will be collected on-site.");
  }

  return (
    <div className="surface-card space-y-4 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-600">Cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.itemId} className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p>{item.date}</p>
              <p>
                {item.participants} x ${item.pricePerPerson}
              </p>
              <button
                type="button"
                className="btn-danger mt-3 px-2 py-1 text-xs"
                onClick={() => removeFromCart(item.itemId)}
              >
                Remove
              </button>
            </div>
          ))}
          <p className="pt-2 text-sm font-semibold text-slate-900">Total: ${total}</p>
          <div className="mt-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            Online payment is disabled. Your spot will be reserved, and payment is due on-site.
          </div>
          <div className="space-y-2">
            <input
              placeholder="Full name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="input-base"
            />
            <input
              type="email"
              placeholder="Email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              className="input-base"
            />
            <input
              placeholder="Phone number"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              className="input-base"
            />
            <textarea
              placeholder="Special requests (optional)"
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              className="input-base"
            />
          </div>
          <button
            type="button"
            disabled={
              isSubmitting || !customerName || !customerEmail || !customerPhone || items.length === 0
            }
            onClick={handleReserve}
            className="btn-primary"
          >
            {isSubmitting ? "Reserving..." : "Reserve Booking"}
          </button>
          {!customerName || !customerEmail || !customerPhone ? (
            <p className="text-xs text-amber-700">
              Fill name, email, and phone to enable reservation.
            </p>
          ) : null}
          {message ? (
            <p
              className={`text-sm ${
                messageType === "success"
                  ? "text-emerald-700"
                  : messageType === "error"
                    ? "text-red-700"
                    : "text-slate-700"
              }`}
            >
              {message}
            </p>
          ) : null}
          {messageType === "success" ? (
            <Link href="/account/bookings" className="block text-sm font-semibold text-primary">
              View my bookings
            </Link>
          ) : null}
          <Link href="/excursions" className="block text-sm font-semibold text-primary hover:underline">
            Continue browsing excursions
          </Link>
        </div>
      )}
    </div>
  );
}
