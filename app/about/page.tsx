import { HeroBanner } from "@/components/common/HeroBanner";

export const metadata = {
  title: "About Fulidhoo | Fulidhoo Tours",
  description: "Learn why V. Fulidhoo is one of the best local islands for ocean experiences.",
};

export default function AboutPage() {
  return (
    <div className="pb-14">
      <HeroBanner
        badge="About Us"
        title="Why visit V. Fulidhoo?"
        description="We help travelers experience Fulidhoo like locals: authentic, safe, and unforgettable."
        backgroundImageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
        minHeightClassName="min-h-[65vh]"
        contentClassName="mx-auto max-w-3xl text-center"
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-bold text-slate-900">Our Story</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Fulidhoo Tours started with one goal: make it easy for visitors to enjoy real local
            island adventures. From reef snorkeling and fishing trips to cultural walks and sunset
            cruises, every trip is planned with trusted guides and safety-first operations.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700">
            We focus on small groups, clear communication, and transparent booking so your Maldives
            experience is smooth from start to finish.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Authentic local island experience",
            "Incredible marine life: sharks, rays, and turtles",
            "Better value than private resort day trips",
            "Friendly guides with deep local knowledge",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
