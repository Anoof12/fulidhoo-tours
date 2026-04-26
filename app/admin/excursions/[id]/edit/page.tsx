import { notFound } from "next/navigation";
import { ExcursionForm } from "@/components/admin/excursions/ExcursionForm";
import { prisma } from "@/lib/prisma";

export default async function AdminEditExcursionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const excursion = await prisma.excursion.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!excursion) notFound();

  return (
    <ExcursionForm
      mode="edit"
      excursionId={excursion.id}
      initialValues={{
        title: excursion.title,
        slug: excursion.slug,
        shortDesc: excursion.shortDesc,
        description: excursion.description,
        category: excursion.category,
        difficulty: excursion.difficulty,
        pricePerPerson: Number(excursion.pricePerPerson),
        groupDiscount: excursion.groupDiscount ? Number(excursion.groupDiscount) : null,
        maxCapacity: excursion.maxCapacity,
        minAge: excursion.minAge,
        duration: excursion.duration,
        meetingPoint: excursion.meetingPoint,
        included: excursion.included.length ? excursion.included : [""],
        excluded: excursion.excluded.length ? excursion.excluded : [""],
        blackoutDates: excursion.blackoutDates.map((d) => d.toISOString().slice(0, 10)),
        isActive: excursion.isActive,
        images: excursion.images.map((image) => ({
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
          order: image.order,
        })),
      }}
    />
  );
}
