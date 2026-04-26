import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  const profile = await prisma.user.findUnique({ where: { id: user!.id } });

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Profile</h1>
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
        <p className="text-slate-500">
          Profile editing endpoint is ready; a live edit form can be connected next.
        </p>
      </div>
    </div>
  );
}
