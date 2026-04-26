export type ExcursionCategory =
  | "Snorkeling"
  | "Diving"
  | "Island Experience"
  | "Fishing"
  | "Water Sports"
  | "Cultural";

export type DifficultyLevel = "Easy" | "Moderate" | "Challenging";

export interface Excursion {
  id: string;
  slug: string;
  title: string;
  category: ExcursionCategory;
  durationLabel: string;
  maxCapacity: number;
  pricePerPerson: number;
  difficulty: DifficultyLevel;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  description: string;
  included: string[];
  excluded: string[];
  meetingPoint: string;
  image: string;
}
