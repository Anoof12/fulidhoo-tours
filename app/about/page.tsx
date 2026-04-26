export const metadata = {
  title: "About Fulidhoo | Fulidhoo Tours",
  description: "Learn why V. Fulidhoo is one of the best local islands for ocean experiences.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">About Us</p>
          <h1 className="font-display mt-3 text-4xl font-bold text-white md:text-6xl">
            Why visit V. Fulidhoo?
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-white/80">
            We help travelers experience Fulidhoo like locals: authentic, safe, and unforgettable.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="surface-card p-7">
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
            <div key={item} className="surface-card p-5">
              <p className="text-slate-700">- {item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
