import Link from "next/link";
import Image from "next/image";
import { ExcursionCard } from "@/components/cards/ExcursionCard";
import { RecentlyViewed } from "@/components/excursions/RecentlyViewed";
import { mapPrismaExcursionToView } from "@/lib/excursionMapper";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const excursions = await prisma.excursion.findMany({
    where: { isActive: true },
    include: { images: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const featured = excursions.map(mapPrismaExcursionToView);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-24 text-white sm:px-6 md:py-32">
          <p className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
            V. Fulidhoo, Maldives
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Explore the island. Book unforgettable local excursions.
          </h1>
          <p className="max-w-2xl text-base text-white/90 md:text-lg">
            Snorkeling, diving, fishing, sunset cruises, and authentic island experiences curated
            by trusted local guides.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/excursions" className="btn-primary bg-white text-accent hover:bg-slate-100">
              Explore Excursions
            </Link>
            <Link href="/about" className="btn-secondary border-white/50 bg-white/10 text-white hover:bg-white/20">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Featured</p>
            <h2 className="font-display text-3xl font-bold text-slate-900">Top Rated Excursions</h2>
            <p className="mt-2 text-slate-600">
              Handpicked adventures with excellent traveler feedback.
            </p>
          </div>
          <Link
            href="/excursions"
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            View all excursions
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((excursion) => (
            <ExcursionCard key={excursion.id} excursion={excursion} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "Trusted Local Guides",
              text: "Experienced island hosts who know every reef, route, and hidden gem.",
            },
            {
              title: "Simple Reservation Flow",
              text: "Reserve online in minutes and pay on-site during your excursion.",
            },
            {
              title: "Small Group Experience",
              text: "Better comfort, safer trips, and a more personal island adventure.",
            },
          ].map((item) => (
            <div key={item.title} className="surface-card p-6">
              <h3 className="font-display text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#14532d] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
              Testimonials
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold">What Our Travelers Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  '"The mountain trek in Patagonia was life-changing. Our guide knew every hidden waterfall and viewpoint. Absolutely incredible experience!"',
                name: "Sarah Mitchell",
                trip: "Patagonia Trek",
                avatar: "http://static.photos/people/200x200/11",
              },
              {
                quote:
                  '"Snorkeling in the Maldives exceeded all expectations. The marine life was spectacular and the team ensured everything was perfect."',
                name: "James Rodriguez",
                trip: "Maldives Snorkeling",
                avatar: "http://static.photos/people/200x200/22",
              },
              {
                quote:
                  '"The cultural tour of Kyoto was magical. From temples to tea ceremonies, every moment was thoughtfully curated. Highly recommend!"',
                name: "Emma Chen",
                trip: "Kyoto Cultural Tour",
                avatar: "http://static.photos/people/200x200/33",
              },
            ].map((item) => (
              <article key={item.name} className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
                <p className="text-2xl leading-relaxed text-white/85">{item.quote}</p>
                <div className="mt-8 flex items-center gap-3">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    className="h-14 w-14 rounded-full object-cover"
                    width={56}
                    height={56}
                  />
                  <div>
                    <p className="text-2xl font-semibold leading-tight text-white">{item.name}</p>
                    <p className="text-xl text-white/60">{item.trip}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <RecentlyViewed />
    </div>
  );
}
