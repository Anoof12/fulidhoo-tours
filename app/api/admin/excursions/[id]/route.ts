import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";
import { excursionAdminSchema } from "@/lib/validators/excursionAdmin";

function canManage(role?: string) {
  return hasAdminPanelAccess(role);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  void request;
  const user = await getCurrentUser();
  if (!canManage(user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const excursion = await prisma.excursion.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!excursion) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(excursion);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!canManage(user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const parsed = excursionAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  try {
    const excursion = await prisma.$transaction(async (tx) => {
      const updated = await tx.excursion.update({
        where: { id },
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
      await tx.excursionImage.deleteMany({ where: { excursionId: id } });
      await tx.excursionImage.createMany({
        data: data.images.map((image, index) => ({
          excursionId: id,
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
          order: image.order ?? index,
        })),
      });
      return updated;
    });
    return NextResponse.json({ success: true, excursion });
  } catch {
    return NextResponse.json({ error: "Failed to update excursion" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  void request;
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.excursion.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
