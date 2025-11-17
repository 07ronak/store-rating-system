import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Clearing old data...");
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Inserting demo users...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: passwordHash,
      address: "Admin HQ",
      role: "ADMIN",
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: "John StoreOwner",
      email: "owner1@example.com",
      password: passwordHash,
      address: "Owner Street 1",
      role: "STORE_OWNER",
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Emily StoreOwner",
      email: "owner2@example.com",
      password: passwordHash,
      address: "Owner Street 2",
      role: "STORE_OWNER",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "Normal User One",
      email: "user1@example.com",
      password: passwordHash,
      address: "User Lane 1",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Normal User Two",
      email: "user2@example.com",
      password: passwordHash,
      address: "User Lane 2",
      role: "USER",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Normal User Three",
      email: "user3@example.com",
      password: passwordHash,
      address: "User Lane 3",
      role: "USER",
    },
  });

  console.log("🌱 Creating stores...");

  const store1 = await prisma.store.create({
    data: {
      name: "Tech World",
      email: "techworld@example.com",
      address: "123 Market Street",
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: "Fresh Mart",
      email: "freshmart@example.com",
      address: "45 Grocery Lane",
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: "Book Haven",
      email: "bookhaven@example.com",
      address: "Library Road 12",
      ownerId: null, // store without owner
    },
  });

  const store4 = await prisma.store.create({
    data: {
      name: "Coffee Corner",
      email: "coffee@example.com",
      address: "Cafe Street 9",
      ownerId: null, // store without owner
    },
  });

  console.log("🌱 Adding ratings from USERS only...");

  const ratings = [
    { userId: user1.id, storeId: store1.id, rating: 5 },
    { userId: user1.id, storeId: store2.id, rating: 4 },
    { userId: user1.id, storeId: store3.id, rating: 5 },
    { userId: user1.id, storeId: store4.id, rating: 3 },

    { userId: user2.id, storeId: store1.id, rating: 3 },
    { userId: user2.id, storeId: store2.id, rating: 5 },
    { userId: user2.id, storeId: store3.id, rating: 4 },
    { userId: user2.id, storeId: store4.id, rating: 2 },

    { userId: user3.id, storeId: store1.id, rating: 4 },
    { userId: user3.id, storeId: store2.id, rating: 2 },
    { userId: user3.id, storeId: store3.id, rating: 5 },
    { userId: user3.id, storeId: store4.id, rating: 3 },
  ];

  await prisma.rating.createMany({ data: ratings });

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
