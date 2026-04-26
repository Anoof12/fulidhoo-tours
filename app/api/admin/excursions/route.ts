import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { excursionAdminSchema } from "@/lib/validators/excursionAdmin";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "TOUR_OPERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = excursionAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  try {
    const excursion = await prisma.$transaction(async (tx) => {
      const created = await tx.excursion.create({
        data: {
          title: data.title,
          slug: data.slug,
          shortDesc: data.shortDesc,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
          pricePerPerson: data.pricePerPerson,
          groupDiscount: data.groupDiscount ?? null,
          maxCapacity: data.maxCapacity,
          minAge: data.minAge ?? null,
          duration: data.duration,
          meetingPoint: data.meetingPoint,
          included: data.included,
          excluded: data.excluded,
          blackoutDates: data.blackoutDates.map((d) => new Date(d)),
          isActive: data.isActive,
        },
      });

      await tx.excursionImage.createMany({
        data: data.images.map((image, index) => ({
          excursionId: created.id,
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
          order: image.order ?? index,
        })),
      });

      return created;
    });

    return NextResponse.json({ success: true, excursion });
  } catch {
    return NextResponse.json({ error: "Failed to create excursion" }, { status: 500 });
  }
}
