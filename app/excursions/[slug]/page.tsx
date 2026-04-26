import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/excursions/BookingWidget";
import { mapPrismaExcursionToView } from "@/lib/excursionMapper";
import { prisma } from "@/lib/prisma";

type ExcursionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ExcursionDetailPage({ params }: ExcursionDetailPageProps) {
  const { slug } = await params;
  const dbExcursion = await prisma.excursion.findUnique({
    where: { slug },
    include: { images: true, reviews: { select: { rating: true } } },
  });
  const excursion = dbExcursion ? mapPrismaExcursionToView(dbExcursion) : null;

  if (!excursion) {
    notFound();
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {excursion.category}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{excursion.title}</h1>
          <p className="text-slate-600">{excursion.shortDescription}</p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-black/5 bg-white p-5 sm:grid-cols-2">
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

        <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Overview</h2>
          <div className="space-y-4 text-slate-700">
            {excursion.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">What&apos;s included</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {excursion.included.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">What&apos;s excluded</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {excursion.excluded.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
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
