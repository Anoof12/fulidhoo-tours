import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const oldPart = "photo-1525715843408-5c6ec44598f6";
const replacement = "photo-1530521954074-e64f6810b32d";

async function main() {
  const rows = await prisma.excursionImage.findMany({
    where: { url: { contains: oldPart } },
    select: { id: true, url: true },
  });

  for (const row of rows) {
    await prisma.excursionImage.update({
      where: { id: row.id },
      data: { url: row.url.replace(oldPart, replacement) },
    });
  }

  console.log(`updated ${rows.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
