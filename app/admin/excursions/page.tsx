import Link from "next/link";
import { ExcursionCategory, Difficulty } from "@prisma/client";
import { BulkExcursionActions } from "@/components/admin/excursions/BulkExcursionActions";
import { DuplicateExcursionButton } from "@/components/admin/excursions/DuplicateExcursionButton";
import { ToggleExcursionActiveButton } from "@/components/admin/ToggleExcursionActiveButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const sortMap = {
  updated: { updatedAt: "desc" as const },
  newest: { createdAt: "desc" as const },
  price_low: { pricePerPerson: "asc" as const },
  price_high: { pricePerPerson: "desc" as const },
  title: { title: "asc" as const },
};

export default async function AdminExcursionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: ExcursionCategory;
    difficulty?: Difficulty;
    status?: "active" | "inactive";
    sort?: keyof typeof sortMap;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const pageSize = 12;
  const sort = params.sort && params.sort in sortMap ? params.sort : "updated";

  const where = {
    ...(params.q
      ? {
          OR: [
            { title: { contains: params.q, mode: "insensitive" as const } },
            { slug: { contains: params.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(params.difficulty ? { difficulty: params.difficulty } : {}),
    ...(params.status === "active" ? { isActive: true } : {}),
    ...(params.status === "inactive" ? { isActive: false } : {}),
  };

  const [excursions, total, bookingLoad] = await Promise.all([
    prisma.excursion.findMany({
      where,
      orderBy: sortMap[sort],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.excursion.count({ where }),
    prisma.booking.groupBy({
      by: ["excursionId"],
      where: { status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] } },
      _sum: { participants: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const query = new URLSearchParams(
    Object.entries({
      q: params.q ?? "",
      category: params.category ?? "",
      difficulty: params.difficulty ?? "",
      status: params.status ?? "",
      sort,
    }).filter(([, value]) => value),
  );
  const exportHref = `/api/admin/excursions/export?${query.toString()}`;
  const loadMap = Object.fromEntries(
    bookingLoad.map((entry) => [entry.excursionId, entry._sum.participants ?? 0]),
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-bold text-slate-900">Manage Excursions</h1>
        <div className="flex flex-wrap gap-2">
          <a href={exportHref} className="btn-secondary">
            Export CSV
          </a>
          <Link href="/admin/excursions/create" className="btn-primary">
            Add Excursion
          </Link>
        </div>
      </div>

      <form className="mb-4 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm md:grid-cols-5">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search title or slug"
          className="input-base md:col-span-2"
        />
        <select name="category" defaultValue={params.category ?? ""} className="input-base">
          <option value="">All categories</option>
          {[
            "SNORKELING",
            "DIVING",
            "ISLAND_EXPERIENCE",
            "FISHING",
            "WATER_SPORTS",
            "CULTURAL",
          ].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select name="difficulty" defaultValue={params.difficulty ?? ""} className="input-base">
          <option value="">All difficulty</option>
          {["EASY", "MODERATE", "CHALLENGING"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={params.status ?? ""} className="input-base">
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select name="sort" defaultValue={sort} className="input-base">
          <option value="updated">Recently updated</option>
          <option value="newest">Newest</option>
          <option value="title">Title A-Z</option>
          <option value="price_low">Price low-high</option>
          <option value="price_high">Price high-low</option>
        </select>
        <div className="grid gap-2 md:col-span-5 sm:grid-cols-2">
          <button type="submit" className="btn-primary w-full justify-center">
            Apply Filters
          </button>
          <Link href="/admin/excursions" className="btn-secondary w-full justify-center">
            Clear Filters
          </Link>
        </div>
      </form>

      <BulkExcursionActions
        rows={excursions.map((item) => ({ id: item.id, label: `${item.title} (${item.slug})` }))}
      />

      <div className="space-y-3">
        {excursions.map((excursion) => (
          <div
            key={excursion.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:border-primary/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {excursion.title} - ${excursion.pricePerPerson.toString()}
                </p>
                <p className="text-xs text-slate-600">
                  slug: {excursion.slug} | updated {new Date(excursion.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800">
                  {excursion.category}
                </span>
                <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-800">
                  {excursion.difficulty}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    excursion.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {excursion.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
            <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              <p>Duration: {excursion.duration} min</p>
              <p>Capacity: {excursion.maxCapacity}</p>
              <p>Booked (active statuses): {loadMap[excursion.id] ?? 0}</p>
              <p>Meeting: {excursion.meetingPoint}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/excursions/${excursion.id}/edit`}
                className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit
              </Link>
              <DuplicateExcursionButton excursionId={excursion.id} />
            </div>
            <ToggleExcursionActiveButton excursionId={excursion.id} isActive={excursion.isActive} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {(page - 1) * pageSize + 1}-{Math.min(total, page * pageSize)} of {total}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <Link
            href={`/admin/excursions?${new URLSearchParams({
              ...Object.fromEntries(query.entries()),
              page: String(Math.max(1, page - 1)),
            }).toString()}`}
            className={`rounded border px-2 py-1 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            Prev
          </Link>
          <span>
            Page {page} / {totalPages}
          </span>
          <Link
            href={`/admin/excursions?${new URLSearchParams({
              ...Object.fromEntries(query.entries()),
              page: String(Math.min(totalPages, page + 1)),
            }).toString()}`}
            className={`rounded border px-2 py-1 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
