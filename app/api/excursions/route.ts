import { ExcursionCategory, Difficulty, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = params.get("search") ?? undefined;
  const categories = params.getAll("category") as ExcursionCategory[];
  const difficulties = params.getAll("difficulty") as Difficulty[];
  const priceMin = Number(params.get("priceMin") ?? "0");
  const priceMax = Number(params.get("priceMax") ?? "9999");
  const page = Number(params.get("page") ?? "1");
  const limit = Number(params.get("limit") ?? "12");
  const sort = params.get("sort") ?? "popular";

  const where: Prisma.ExcursionWhereInput = {
    isActive: true,
    pricePerPerson: { gte: priceMin, lte: priceMax },
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categories.length ? { category: { in: categories } } : {}),
    ...(difficulties.length ? { difficulty: { in: difficulties } } : {}),
  };

  const orderBy: Prisma.ExcursionOrderByWithRelationInput =
    sort === "price_low"
      ? { pricePerPerson: "asc" }
      : sort === "price_high"
        ? { pricePerPerson: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : { createdAt: "desc" };

  const [total, data] = await Promise.all([
    prisma.excursion.count({ where }),
    prisma.excursion.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 }, reviews: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    },
  });
}
