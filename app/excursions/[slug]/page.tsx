import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/excursions/BookingWidget";
import { FavoriteButton } from "@/components/excursions/FavoriteButton";
import { ShareButton } from "@/components/excursions/ShareButton";
import { ViewedTracker } from "@/components/excursions/ViewedTracker";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getCurrentUser } from "@/lib/auth";
import { mapPrismaExcursionToView } from "@/lib/excursionMapper";
import { prisma } from "@/lib/prisma";

type ExcursionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ExcursionDetailPage({ params }: ExcursionDetailPageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const dbExcursion = await prisma.excursion.findUnique({
    where: { slug },
    include: {
      images: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  const excursion = dbExcursion ? mapPrismaExcursionToView(dbExcursion) : null;

  if (!excursion) {
    notFound();
  }
  const reviews = dbExcursion?.reviews ?? [];

  const canReview = user
    ? Boolean(
        await prisma.booking.findFirst({
          where: { userId: user.id, excursionId: excursion.id, status: "COMPLETED" },
          select: { id: true },
        }),
      )
    : false;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.45fr_1fr]">
      <ViewedTracker slug={excursion.slug} />
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {excursion.category}
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900 md:text-5xl">
            {excursion.title}
          </h1>
          <p className="text-slate-600">{excursion.shortDescription}</p>
        </div>

        <div className="surface-card grid gap-3 p-5 sm:grid-cols-2">
          <p className="text-sm text-slate-700">
            <strong>Duration:</strong> {excursion.durationLabel}
          </p>
          <p className="text-sm text-slate-700">
            <strong>Difficulty:</strong> {excursion.difficulty}
          </p>
          <p className="text-sm text-slate-700">
            <strong>Capacity:</strong> Up to {excursion.maxCapacity} guests
          </p>
          <p className="text-sm text-slate-700">
            <strong>Meeting Point:</strong> {excursion.meetingPoint}
          </p>
        </div>

        <div className="surface-card space-y-4 p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">About This Excursion</h2>
          <div className="space-y-4 text-slate-700">
            {excursion.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-card p-5">
            <h3 className="font-display text-xl font-semibold text-slate-900">What&apos;s included</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {excursion.included.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-5">
            <h3 className="font-display text-xl font-semibold text-slate-900">What&apos;s excluded</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {excursion.excluded.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="surface-card space-y-4 p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">Traveler Reviews</h2>
          {canReview ? <ReviewForm excursionId={excursion.id} /> : null}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-600">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {review.user.name ?? "Guest"} - {review.rating}/5
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  {review.comment ? <p className="mt-1 text-sm text-slate-700">{review.comment}</p> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <aside className="surface-card h-fit p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">From</p>
        <p className="mt-1 text-4xl font-black text-slate-900">${excursion.pricePerPerson}</p>
        <p className="text-sm text-slate-600">per person</p>

        <div className="mt-6 space-y-2 text-sm text-slate-700">
          <p>
            <strong>Rating:</strong> {excursion.rating} ({excursion.reviewsCount} reviews)
          </p>
          <p>
            <strong>Instant confirmation:</strong> Yes
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <FavoriteButton excursionId={excursion.id} />
          <ShareButton title={excursion.title} url={`/excursions/${excursion.slug}`} />
        </div>

        <div className="mt-6">
          <BookingWidget
            excursionId={excursion.id}
            title={excursion.title}
            pricePerPerson={excursion.pricePerPerson}
            maxCapacity={excursion.maxCapacity}
          />
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Add to cart and continue to checkout.
        </p>
      </aside>
    </div>
  );
}
