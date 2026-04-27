import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  isActive: z.boolean(),
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await prisma.excursion.updateMany({
    where: { id: { in: parsed.data.ids } },
    data: { isActive: parsed.data.isActive },
  });

  return NextResponse.json({ success: true, updated: result.count });
}
