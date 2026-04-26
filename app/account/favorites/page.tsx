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
    <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-5">
      <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-sm text-slate-600">No favorites yet. Save excursions you like.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{favorite.excursion.title}</p>
              <p className="text-sm text-slate-600">{favorite.excursion.shortDesc}</p>
              <Link
                href={`/excursions/${favorite.excursion.slug}`}
                className="mt-2 inline-block text-sm font-semibold text-primary underline"
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
