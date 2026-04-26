import { z } from "zod";

const imageSchema = z.object({
  url: z.url("Image URL is required"),
  altText: z.string().min(1, "Alt text is required"),
  isPrimary: z.boolean(),
  order: z.number().int().min(0),
});

export const excursionAdminSchema = z.object({
  title: z.string().min(5).max(100),
  slug: z
    .string()
    .min(5)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  shortDesc: z.string().min(20).max(150),
  description: z.string().min(100),
  category: z.enum([
    "SNORKELING",
    "DIVING",
    "ISLAND_EXPERIENCE",
    "FISHING",
    "WATER_SPORTS",
    "CULTURAL",
  ]),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING"]),
  pricePerPerson: z.coerce.number().min(1),
  groupDiscount: z.coerce.number().min(0).max(100).nullable().optional(),
  maxCapacity: z.coerce.number().int().min(1),
  minAge: z.coerce.number().int().min(0).nullable().optional(),
  duration: z.coerce.number().int().min(15),
  meetingPoint: z.string().min(5),
  included: z.array(z.string().min(1)).min(1),
  excluded: z.array(z.string().min(1)).min(1),
  images: z.array(imageSchema).min(1),
  blackoutDates: z.array(z.string()).default([]),
  isActive: z.boolean(),
});

export type ExcursionAdminInput = z.infer<typeof excursionAdminSchema>;
