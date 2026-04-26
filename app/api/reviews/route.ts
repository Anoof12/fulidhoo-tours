import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  excursionId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { excursionId, rating, comment } = parsed.data;
  const completedBooking = await prisma.booking.findFirst({
    where: {
      userId: user.id,
      excursionId,
      status: "COMPLETED",
    },
  });
  if (!completedBooking) {
    return NextResponse.json(
      { error: "You can review only after completing this excursion." },
      { status: 400 },
    );
  }

  const existing = await prisma.review.findUnique({
    where: { excursionId_userId: { excursionId, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "You already reviewed this excursion." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      excursionId,
      userId: user.id,
      rating,
      comment,
    },
  });

  return NextResponse.json({ success: true, review });
}
