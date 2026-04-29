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

  const guideStaffPassword = await bcrypt.hash("GuideStaff123!", 12);

  await prisma.user.upsert({
    where: { email: "guide@fulidhootours.com" },
    update: {},
    create: {
      email: "guide@fulidhootours.com",
      password: guideStaffPassword,
      role: Role.GUIDE,
      name: "Demo Guide",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@fulidhootours.com" },
    update: {},
    create: {
      email: "staff@fulidhootours.com",
      password: guideStaffPassword,
      role: Role.STAFF,
      name: "Demo Staff",
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

  const customerNames = [
    "Aisha",
    "Ibrahim",
    "Zara",
    "Hassan",
    "Maya",
    "Imran",
    "Leena",
    "Nashid",
    "Sara",
    "Yameen",
    "Nadia",
    "Ali",
    "Shifa",
    "Riyaz",
    "Liyana",
    "Aslam",
    "Nifal",
    "Hiba",
    "Adam",
    "Aminath",
  ];

  const customers: Awaited<ReturnType<typeof prisma.user.upsert>>[] = [];
  for (let index = 0; index < customerNames.length; index += 1) {
    const name = customerNames[index];
    const seededUser = await prisma.user.upsert({
      where: { email: `demo${index + 1}@example.com` },
      update: { name },
      create: {
        email: `demo${index + 1}@example.com`,
        password: customerPassword,
        role: Role.CUSTOMER,
        name,
        phone: `+960700${String(index + 1).padStart(4, "0")}`,
        country: index % 2 === 0 ? "Maldives" : "Sri Lanka",
      },
    });
    customers.push(seededUser);
  }

  const allCustomers = [customer, ...customers];

  const excursions = [
    {
      title: "Shark Point Snorkeling",
      slug: "shark-point-snorkeling",
      category: "SNORKELING",
      duration: 180,
      maxCapacity: 8,
      pricePerPerson: 50,
      difficulty: "MODERATE",
      meetingPoint: "Fulidhoo Main Jetty",
      included: ["Guide", "Snorkeling gear", "Water", "Safety briefing"],
      excluded: ["Personal expenses", "Tips"],
      image:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Stingray Beach Experience",
      slug: "stingray-beach-experience",
      category: "SNORKELING",
      duration: 120,
      maxCapacity: 12,
      pricePerPerson: 25,
      difficulty: "EASY",
      meetingPoint: "Beachside Dock",
      included: ["Guide", "Water", "Snorkel mask"],
      excluded: ["Hotel transfer"],
      image:
        "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Sunset Cruise",
      slug: "sunset-cruise",
      category: "ISLAND_EXPERIENCE",
      duration: 120,
      maxCapacity: 15,
      pricePerPerson: 45,
      difficulty: "EASY",
      meetingPoint: "Harbor Pier",
      included: ["Boat ride", "Refreshments", "Guide"],
      excluded: ["Private pickup"],
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Night Fishing Adventure",
      slug: "night-fishing-adventure",
      category: "FISHING",
      duration: 210,
      maxCapacity: 10,
      pricePerPerson: 55,
      difficulty: "MODERATE",
      meetingPoint: "Fulidhoo Main Jetty",
      included: ["Fishing gear", "Guide", "Bait", "Water"],
      excluded: ["Meal"],
      image:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Turtle Reef Discovery",
      slug: "turtle-reef-discovery",
      category: "SNORKELING",
      duration: 150,
      maxCapacity: 9,
      pricePerPerson: 40,
      difficulty: "EASY",
      meetingPoint: "Turtle Point Dock",
      included: ["Guide", "Snorkeling gear", "Water"],
      excluded: ["GoPro rental"],
      image:
        "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Sandbank Picnic Escape",
      slug: "sandbank-picnic-escape",
      category: "ISLAND_EXPERIENCE",
      duration: 240,
      maxCapacity: 14,
      pricePerPerson: 60,
      difficulty: "EASY",
      meetingPoint: "Harbor Pier",
      included: ["Boat transfer", "Picnic setup", "Guide", "Water"],
      excluded: ["Professional photos"],
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Beginners Scuba Intro",
      slug: "beginners-scuba-intro",
      category: "DIVING",
      duration: 180,
      maxCapacity: 6,
      pricePerPerson: 95,
      difficulty: "CHALLENGING",
      meetingPoint: "Dive Center Front Desk",
      included: ["Instructor", "Dive gear", "Tank", "Safety briefing"],
      excluded: ["Certification fee"],
      image:
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Cultural Island Walk",
      slug: "cultural-island-walk",
      category: "CULTURAL",
      duration: 90,
      maxCapacity: 18,
      pricePerPerson: 20,
      difficulty: "EASY",
      meetingPoint: "Island Square",
      included: ["Local guide", "Tea stop"],
      excluded: ["Souvenirs"],
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    },
  ] as const;

  const excursionRecords: Array<{ id: string; slug: string; maxCapacity: number; pricePerPerson: number }> = [];

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
        included: [...excursion.included],
        excluded: [...excursion.excluded],
        meetingPoint: excursion.meetingPoint,
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
        included: [...excursion.included],
        excluded: [...excursion.excluded],
        meetingPoint: excursion.meetingPoint,
        difficulty: excursion.difficulty,
      },
    });

    await prisma.excursionImage.deleteMany({
      where: { excursionId: created.id },
    });
    await prisma.excursionImage.create({
      data: {
        excursionId: created.id,
        url: excursion.image,
        altText: created.title,
        isPrimary: true,
        order: 0,
      },
    });
    await prisma.excursionImage.create({
      data: {
        excursionId: created.id,
        url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
        altText: `${created.title} alternate`,
        isPrimary: false,
        order: 1,
      },
    });

    excursionRecords.push({
      id: created.id,
      slug: created.slug,
      maxCapacity: excursion.maxCapacity,
      pricePerPerson: excursion.pricePerPerson,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 140; i += 1) {
    const selectedUser = allCustomers[i % allCustomers.length];
    const excursion = excursionRecords[i % excursionRecords.length];
    const participants = (i % 4) + 1;
    const offsetDays = (i % 70) - 15;
    const bookingDate = new Date(today);
    bookingDate.setDate(today.getDate() + offsetDays);
    bookingDate.setHours(9 + (i % 5), 0, 0, 0);

    const status =
      offsetDays < -2
        ? "COMPLETED"
        : i % 9 === 0
          ? "CANCELLED"
          : i % 3 === 0
            ? "PENDING"
            : "CONFIRMED";

    await prisma.booking.upsert({
      where: { bookingNumber: `DEMO-BK-${String(i + 1).padStart(4, "0")}` },
      update: {
        userId: selectedUser.id,
        excursionId: excursion.id,
        bookingDate,
        participants,
        totalPrice: participants * excursion.pricePerPerson,
        status,
        customerName: selectedUser.name ?? `Customer ${i + 1}`,
        customerEmail: selectedUser.email,
        customerPhone: selectedUser.phone ?? "+9609000000",
        specialRequests:
          i % 7 === 0 ? "Please arrange vegetarian snacks and shaded seating if possible." : null,
      },
      create: {
        bookingNumber: `DEMO-BK-${String(i + 1).padStart(4, "0")}`,
        userId: selectedUser.id,
        excursionId: excursion.id,
        bookingDate,
        participants,
        totalPrice: participants * excursion.pricePerPerson,
        status,
        customerName: selectedUser.name ?? `Customer ${i + 1}`,
        customerEmail: selectedUser.email,
        customerPhone: selectedUser.phone ?? "+9609000000",
        specialRequests:
          i % 7 === 0 ? "Please arrange vegetarian snacks and shaded seating if possible." : null,
      },
    });
  }

  for (let i = 0; i < 45; i += 1) {
    const selectedUser = allCustomers[i % allCustomers.length];
    const excursion = excursionRecords[i % excursionRecords.length];
    const rating = (i % 5) + 1;
    const comment = [
      "Amazing experience with friendly guides.",
      "Well organized and suitable for families.",
      "Great value and memorable trip.",
      "Would definitely book again.",
      "Beautiful spots and smooth logistics.",
    ][i % 5];

    await prisma.review.upsert({
      where: { excursionId_userId: { excursionId: excursion.id, userId: selectedUser.id } },
      update: { rating, comment },
      create: {
        excursionId: excursion.id,
        userId: selectedUser.id,
        rating,
        comment,
      },
    });
  }

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

  console.log("Seed completed", {
    admin: admin.email,
    totalCustomers: allCustomers.length,
    totalExcursions: excursionRecords.length,
    totalBookingsSeeded: 140,
    totalReviewsSeeded: 45,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
