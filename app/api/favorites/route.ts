import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCustomerPortalAccess } from "@/lib/roles";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasCustomerPortalAccess(user.role)) {
    return NextResponse.json({ error: "Only customer accounts can access favorites." }, { status: 403 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      excursion: {
        include: { images: true, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: favorites });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasCustomerPortalAccess(user.role)) {
    return NextResponse.json({ error: "Only customer accounts can access favorites." }, { status: 403 });
  }

  const body = (await request.json()) as { excursionId?: string };
  if (!body.excursionId) {
    return NextResponse.json({ error: "excursionId is required" }, { status: 400 });
  }

  const favorite = await prisma.favorite.upsert({
    where: {
      userId_excursionId: {
        userId: user.id,
        excursionId: body.excursionId,
      },
    },
    create: { userId: user.id, excursionId: body.excursionId },
    update: {},
  });

  return NextResponse.json({ success: true, favorite });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasCustomerPortalAccess(user.role)) {
    return NextResponse.json({ error: "Only customer accounts can access favorites." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const excursionId = searchParams.get("excursionId");
  if (!excursionId) {
    return NextResponse.json({ error: "excursionId is required" }, { status: 400 });
  }

  await prisma.favorite.delete({
    where: {
      userId_excursionId: {
        userId: user.id,
        excursionId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
