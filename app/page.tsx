import { RecentlyViewed } from "@/components/excursions/RecentlyViewed";
import { FeaturedExcursionsSection } from "@/components/home/FeaturedExcursionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ValuePropsSection } from "@/components/home/ValuePropsSection";
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
      <HeroSection />
      <FeaturedExcursionsSection excursions={featured} />
      <ValuePropsSection />
      <RecentlyViewed />
    </div>
  );
}
