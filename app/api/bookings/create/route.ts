import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCustomerPortalAccess } from "@/lib/roles";

const schema = z.object({
  items: z.array(
    z.object({
      excursionId: z.string(),
      date: z.string(),
      participants: z.number().int().positive(),
    }),
  ),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  specialRequests: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasCustomerPortalAccess(user.role)) {
      return NextResponse.json({ error: "Only customer accounts can create bookings." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = schema.parse(body);

    if (!parsed.items.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const results = [];

      for (let index = 0; index < parsed.items.length; index += 1) {
        const item = parsed.items[index];
        const excursion = await tx.excursion.findUnique({
          where: { id: item.excursionId },
          select: { id: true, maxCapacity: true, title: true, pricePerPerson: true, isActive: true },
        });
        if (!excursion) {
          throw new Error("Selected excursion no longer exists. Please refresh and try again.");
        }
        if (!excursion.isActive) {
          throw new Error(`${excursion.title} is no longer available.`);
        }

        const bookingDate = new Date(item.date);
        if (Number.isNaN(bookingDate.getTime())) {
          throw new Error("Invalid booking date.");
        }

        const start = new Date(bookingDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(bookingDate);
        end.setHours(23, 59, 59, 999);

        const booked = await tx.booking.aggregate({
          where: {
            excursionId: item.excursionId,
            bookingDate: { gte: start, lte: end },
            status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
          },
          _sum: { participants: true },
        });
        const bookedSeats = booked._sum.participants ?? 0;
        const spotsRemaining = excursion.maxCapacity - bookedSeats;

        if (item.participants > spotsRemaining) {
          throw new Error(
            `${excursion.title} has only ${Math.max(0, spotsRemaining)} spots left on this date.`,
          );
        }

        // Calculate price server-side to prevent client manipulation
        const totalPrice = Number(excursion.pricePerPerson) * item.participants;

        const booking = await tx.booking.create({
          data: {
            bookingNumber: `BK-${Date.now()}-${index + 1}`,
            userId: user.id,
            excursionId: item.excursionId,
            bookingDate,
            participants: item.participants,
            totalPrice,
            status: "CONFIRMED",
            customerName: parsed.customerName,
            customerEmail: parsed.customerEmail,
            customerPhone: parsed.customerPhone,
            specialRequests: parsed.specialRequests,
          },
        });
        results.push(booking);
      }

      return results;
    });

    return NextResponse.json({ bookings: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid booking input. Please complete all required fields." },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Booking failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
