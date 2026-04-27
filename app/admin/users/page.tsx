import { DeleteUserButton } from "@/components/admin/users/DeleteUserButton";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      country: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Admin</p>
        <h1 className="font-display mt-2 text-3xl font-bold text-slate-900">All Users</h1>
        <p className="mt-1 text-sm text-slate-600">All accounts created in the system.</p>
      </div>

      {users.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          No users found.
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{user.name ?? "Unnamed user"}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                  {user.role.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-1">{user.email}</p>
              <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                <p>Phone: {user.phone ?? "-"}</p>
                <p>Country: {user.country ?? "-"}</p>
                <p>Bookings: {user._count.bookings}</p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <DeleteUserButton
                  userId={user.id}
                  userLabel={user.email}
                  disabled={currentUser?.id === user.id || currentUser?.role !== "ADMIN"}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
