import { redirect } from "next/navigation";
import { BookingCountdown } from "@/components/booking/BookingCountdown";
import { getCurrentUser } from "@/lib/auth";
import { CartSummary } from "@/components/cart/CartSummary";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl">
        Reserve Your Booking
      </h1>
      <p className="mb-5 text-sm text-slate-600 sm:mb-6">
        Confirm your excursion details and reserve your spot now. Payment will be made on-site.
      </p>
      <div className="mb-5">
        <BookingCountdown minutes={15} label="Reservation session" />
      </div>
      <CartSummary />
    </div>
  );
}
