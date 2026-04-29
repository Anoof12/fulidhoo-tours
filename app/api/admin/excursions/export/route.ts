import { NextResponse } from "next/server";
import { ExcursionCategory, Difficulty } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";

function csvEscape(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status");

  const excursions = await prisma.excursion.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category ? { category: category as ExcursionCategory } : {}),
      ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
      ...(status === "active" ? { isActive: true } : {}),
      ...(status === "inactive" ? { isActive: false } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  const header = [
    "Title",
    "Slug",
    "Category",
    "Difficulty",
    "PricePerPerson",
    "MaxCapacity",
    "DurationMinutes",
    "IsActive",
    "MeetingPoint",
    "UpdatedAt",
  ].join(",");

  const rows = excursions.map((item) =>
    [
      item.title,
      item.slug,
      item.category,
      item.difficulty,
      item.pricePerPerson.toString(),
      String(item.maxCapacity),
      String(item.duration),
      item.isActive ? "ACTIVE" : "INACTIVE",
      item.meetingPoint,
      item.updatedAt.toISOString(),
    ]
      .map(csvEscape)
      .join(","),
  );

  return new NextResponse([header, ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="excursions-${Date.now()}.csv"`,
    },
  });
}
