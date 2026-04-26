import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.nativeEnum(BookingStatus),
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "TOUR_OPERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await prisma.booking.updateMany({
    where: { id: { in: parsed.data.ids } },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ success: true, updated: result.count });
}
