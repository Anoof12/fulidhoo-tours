import { Difficulty, Excursion as PrismaExcursion, ExcursionCategory, Review } from "@prisma/client";
import { Excursion } from "@/types/excursion";

function formatCategory(category: ExcursionCategory): Excursion["category"] {
  const map: Record<ExcursionCategory, Excursion["category"]> = {
    SNORKELING: "Snorkeling",
    DIVING: "Diving",
    ISLAND_EXPERIENCE: "Island Experience",
    FISHING: "Fishing",
    WATER_SPORTS: "Water Sports",
    CULTURAL: "Cultural",
  };
  return map[category];
}

function formatDifficulty(difficulty: Difficulty): Excursion["difficulty"] {
  const map: Record<Difficulty, Excursion["difficulty"]> = {
    EASY: "Easy",
    MODERATE: "Moderate",
    CHALLENGING: "Challenging",
  };
  return map[difficulty];
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) return `${hours} hours`;
  return `${hours.toFixed(1)} hours`;
}

export function mapPrismaExcursionToView(
  excursion: PrismaExcursion & {
    images?: { url: string; isPrimary: boolean }[];
    reviews?: Pick<Review, "rating">[];
  },
): Excursion {
  const ratings = excursion.reviews?.map((review) => review.rating) ?? [];
  const avg = ratings.length
    ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
    : 0;
  const primaryImage =
    excursion.images?.find((image) => image.isPrimary)?.url ??
    excursion.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return {
    id: excursion.id,
    slug: excursion.slug,
    title: excursion.title,
    category: formatCategory(excursion.category),
    durationLabel: formatDuration(excursion.duration),
    maxCapacity: excursion.maxCapacity,
    pricePerPerson: Number(excursion.pricePerPerson),
    difficulty: formatDifficulty(excursion.difficulty),
    rating: avg,
    reviewsCount: ratings.length,
    shortDescription: excursion.shortDesc,
    description: excursion.description,
    included: excursion.included,
    excluded: excursion.excluded,
    meetingPoint: excursion.meetingPoint,
    image: primaryImage,
  };
}
