import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const favorites = await prisma.favorite.findMany({
    where: { userId: user!.id },
    include: {
      excursion: {
        include: { images: { orderBy: { order: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
      <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">No favorites yet. Save excursions you like.</p>
          <Link href="/excursions" className="mt-2 inline-block text-sm font-semibold text-primary">
            Explore excursions
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{favorite.excursion.title}</p>
              <p className="text-sm text-slate-600">{favorite.excursion.shortDesc}</p>
              <Link
                href={`/excursions/${favorite.excursion.slug}`}
                className="mt-3 inline-block text-sm font-semibold text-primary"
              >
                View excursion
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
