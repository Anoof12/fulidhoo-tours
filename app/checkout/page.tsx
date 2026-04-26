import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CartSummary } from "@/components/cart/CartSummary";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-4 text-3xl font-bold text-slate-900">Reserve Your Booking</h1>
      <p className="mb-6 text-sm text-slate-600">
        Confirm your excursion details and reserve your spot now. Payment will be made on-site.
      </p>
      <CartSummary />
    </div>
  );
}
