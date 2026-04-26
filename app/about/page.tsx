export const metadata = {
  title: "About Fulidhoo | Fulidhoo Tours",
  description: "Learn why V. Fulidhoo is one of the best local islands for ocean experiences.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Why Visit V. Fulidhoo?</h1>
      <p className="mt-4 text-slate-700">
        Fulidhoo is a peaceful local island in Vaavu Atoll, known for warm hospitality, beautiful
        beaches, and easy access to world-class snorkeling and diving sites.
      </p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-black/5 bg-white p-6">
        <p className="text-slate-700">- Authentic local island experience</p>
        <p className="text-slate-700">- Incredible marine life: sharks, rays, and turtles</p>
        <p className="text-slate-700">- Better value than private resort day trips</p>
        <p className="text-slate-700">- Friendly guides with deep local knowledge</p>
      </div>
    </div>
  );
}
