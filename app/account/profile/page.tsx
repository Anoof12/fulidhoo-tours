import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  const profile = await prisma.user.findUnique({ where: { id: user!.id } });

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
      <h1 className="mb-4 mt-2 text-2xl font-bold text-slate-900">Profile</h1>
      <div className="grid gap-3 text-sm text-slate-700">
        <p>
          <strong>Name:</strong> {profile?.name ?? "-"}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile?.phone ?? "-"}
        </p>
        <p>
          <strong>Country:</strong> {profile?.country ?? "-"}
        </p>
        <p className="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-slate-500">
          Profile editing endpoint is ready; a live edit form can be connected next.
        </p>
      </div>
    </div>
  );
}
