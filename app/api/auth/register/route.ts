import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl || databaseUrl === "..." || !databaseUrl.startsWith("postgresql://")) {
      return NextResponse.json(
        {
          error:
            "Server is not configured for database access. Set DATABASE_URL (and DIRECT_URL for migrations) in .env using your Supabase PostgreSQL connection strings.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const email = parsed.email.toLowerCase();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const password = await bcrypt.hash(parsed.password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name: parsed.name,
        phone: parsed.phone,
        country: parsed.country,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.flatten() }, { status: 400 });
    }
    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error";
    return NextResponse.json(
      {
        error: "Registration failed",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
