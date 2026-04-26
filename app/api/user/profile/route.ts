import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, phone: true, country: true, role: true },
  });
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = updateSchema.parse(body);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { id: true, name: true, email: true, phone: true, country: true, role: true },
  });
  return NextResponse.json(updated);
}
