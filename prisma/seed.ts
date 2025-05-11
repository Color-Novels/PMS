import { Gender, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function createUsers() {
  console.log("\n--- Creating Users ---");

  // Create staff users
  const staffUsers = [
    {
      email: "drdinej@gmail.com",
      mobile: "0765432189",
      password: "$2a$10$B/OCeM1hONRl8UjZJn15GeYQaKOLl8FVIJZABHQpUbu0W9OVXjRbi",
      role: Role.DOCTOR,
      gender: Gender.MALE,
      name: "Dinej Chandrasiri",
    },
  ];

  for (const user of staffUsers) {
    await prisma.user.create({ data: user });
    console.log(`Created ${user.role.toLowerCase()}: ${user.name}`);
  }
}

async function main() {
  console.log("\nStarting database seeding...");

  await createUsers();
  console.log("\nDatabase seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
