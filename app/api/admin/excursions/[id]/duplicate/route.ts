import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";

function uniqueSlug(base: string) {
  return `${base}-copy-${Math.random().toString(36).slice(2, 7)}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  void request;
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const source = await prisma.excursion.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!source) return NextResponse.json({ error: "Excursion not found" }, { status: 404 });

  const created = await prisma.$transaction(async (tx) => {
    const copy = await tx.excursion.create({
      data: {
        title: `${source.title} (Copy)`,
        slug: uniqueSlug(source.slug),
        description: source.description,
        shortDesc: source.shortDesc,
        category: source.category,
        duration: source.duration,
        maxCapacity: source.maxCapacity,
        pricePerPerson: source.pricePerPerson,
        groupDiscount: source.groupDiscount,
        included: source.included,
        excluded: source.excluded,
        meetingPoint: source.meetingPoint,
        difficulty: source.difficulty,
        minAge: source.minAge,
        blackoutDates: source.blackoutDates,
        isActive: false,
      },
    });

    if (source.images.length) {
      await tx.excursionImage.createMany({
        data: source.images.map((img, index) => ({
          excursionId: copy.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          order: img.order ?? index,
        })),
      });
    }
    return copy;
  });

  return NextResponse.json({ success: true, excursion: created });
}
