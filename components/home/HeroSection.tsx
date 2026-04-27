import Link from "next/link";
import { HeroBanner } from "@/components/common/HeroBanner";

export function HeroSection() {
  return (
    <HeroBanner
      badge="V. Fulidhoo, Maldives"
      title="Fulidhoo Tours"
      subtitle="Discover island adventures with local experts"
      description="Book snorkeling, diving, sandbank trips, and authentic Fulidhoo experiences with a cleaner, modern booking flow inspired by the new reference design."
      backgroundImageUrl="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1800&q=80"
      minHeightClassName="min-h-[90vh]"
    >
      <Link href="/excursions" className="btn-primary bg-white text-emerald-900 hover:bg-slate-100">
        Explore Excursions
      </Link>
      <Link href="/about" className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white/20">
        About Fulidhoo
      </Link>
    </HeroBanner>
  );
}
