import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const customerPassword = await bcrypt.hash("Customer123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fulidhootours.com" },
    update: {},
    create: {
      email: "admin@fulidhootours.com",
      password: adminPassword,
      role: Role.ADMIN,
      name: "Admin User",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      name: "Demo Customer",
    },
  });

  const excursions = [
    {
      title: "Shark Point Snorkeling",
      slug: "shark-point-snorkeling",
      category: "SNORKELING",
      duration: 180,
      maxCapacity: 8,
      pricePerPerson: 50,
      difficulty: "MODERATE",
    },
    {
      title: "Stingray Beach Experience",
      slug: "stingray-beach-experience",
      category: "SNORKELING",
      duration: 120,
      maxCapacity: 12,
      pricePerPerson: 25,
      difficulty: "EASY",
    },
    {
      title: "Sunset Cruise",
      slug: "sunset-cruise",
      category: "ISLAND_EXPERIENCE",
      duration: 120,
      maxCapacity: 15,
      pricePerPerson: 45,
      difficulty: "EASY",
    },
  ] as const;

  for (const excursion of excursions) {
    const created = await prisma.excursion.upsert({
      where: { slug: excursion.slug },
      update: {
        title: excursion.title,
        description: `${excursion.title} curated by Fulidhoo Tours local guides.`,
        shortDesc: `Enjoy ${excursion.title.toLowerCase()} in V. Fulidhoo.`,
        category: excursion.category,
        duration: excursion.duration,
        maxCapacity: excursion.maxCapacity,
        pricePerPerson: excursion.pricePerPerson,
        included: ["Guide", "Safety briefing", "Water"],
        excluded: ["Personal expenses", "Tips"],
        meetingPoint: "Fulidhoo Main Jetty",
        difficulty: excursion.difficulty,
      },
      create: {
        title: excursion.title,
        slug: excursion.slug,
        description: `${excursion.title} curated by Fulidhoo Tours local guides.`,
        shortDesc: `Enjoy ${excursion.title.toLowerCase()} in V. Fulidhoo.`,
        category: excursion.category,
        duration: excursion.duration,
        maxCapacity: excursion.maxCapacity,
        pricePerPerson: excursion.pricePerPerson,
        included: ["Guide", "Safety briefing", "Water"],
        excluded: ["Personal expenses", "Tips"],
        meetingPoint: "Fulidhoo Main Jetty",
        difficulty: excursion.difficulty,
      },
    });

    await prisma.excursionImage.deleteMany({
      where: { excursionId: created.id },
    });
    await prisma.excursionImage.create({
      data: {
        excursionId: created.id,
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        altText: created.title,
        isPrimary: true,
        order: 1,
      },
    });
  }

  const sharkExcursion = await prisma.excursion.findUniqueOrThrow({
    where: { slug: "shark-point-snorkeling" },
  });

  await prisma.booking.upsert({
    where: { bookingNumber: "DEMO-BK-0001" },
    update: {
      userId: customer.id,
      excursionId: sharkExcursion.id,
      bookingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      participants: 2,
      totalPrice: 100,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      customerName: "Demo Customer",
      customerEmail: customer.email,
      customerPhone: "+9609000000",
    },
    create: {
      bookingNumber: "DEMO-BK-0001",
      userId: customer.id,
      excursionId: sharkExcursion.id,
      bookingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      participants: 2,
      totalPrice: 100,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      customerName: "Demo Customer",
      customerEmail: customer.email,
      customerPhone: "+9609000000",
    },
  });

  await prisma.settings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      businessName: "Fulidhoo Tours",
      businessEmail: "hello@fulidhootours.com",
      businessPhone: "+960 999 1234",
      cancellationPolicy: "Free cancellation up to 24 hours before excursion start.",
      termsAndConditions: "Standard island excursion terms and safety requirements apply.",
    },
  });

  console.log("Seed completed", { admin: admin.email, customer: customer.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
