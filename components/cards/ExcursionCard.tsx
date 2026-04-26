import Image from "next/image";
import Link from "next/link";
import { CapacityBar } from "@/components/excursions/CapacityBar";
import { FavoriteButton } from "@/components/excursions/FavoriteButton";
import { Excursion } from "@/types/excursion";

type ExcursionCardProps = {
  excursion: Excursion;
  booked?: number;
  showAvailabilityBadge?: boolean;
};

export function ExcursionCard({
  excursion,
  booked = 0,
  showAvailabilityBadge = true,
}: ExcursionCardProps) {
  const safeBooked = Math.max(0, Math.min(booked, excursion.maxCapacity));
  const percentage = Math.round((safeBooked / Math.max(1, excursion.maxCapacity)) * 100);

  return (
    <article className="surface-card interactive-card overflow-hidden shadow-sm">
      <div className="relative h-52 w-full">
        <Image
          src={excursion.image}
          alt={excursion.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {excursion.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">{excursion.difficulty}</span>
            <FavoriteButton excursionId={excursion.id} />
          </div>
        </div>
        {showAvailabilityBadge ? <CapacityBar current={safeBooked} max={excursion.maxCapacity} variant="badge" /> : null}
        {percentage > 90 ? (
          <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            Almost Full
          </span>
        ) : null}

        <h3 className="text-lg font-semibold text-slate-900">{excursion.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{excursion.shortDescription}</p>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{excursion.durationLabel}</span>
          <span>Up to {excursion.maxCapacity} guests</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-slate-900">${excursion.pricePerPerson}</p>
          <p className="text-sm text-slate-600">
            {excursion.rating} ({excursion.reviewsCount})
          </p>
        </div>
        <div className="space-y-1">
          <CapacityBar current={safeBooked} max={excursion.maxCapacity} variant="text" />
          <CapacityBar current={safeBooked} max={excursion.maxCapacity} variant="bar" />
        </div>

        <Link
          href={`/excursions/${excursion.slug}`}
          className="btn-primary w-full"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
