import { PrismaClient } from "@prisma/client";
import "dotenv/config";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient();
}

// Avoid creating multiple Prisma clients in development (hot-reload)
if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = createPrismaClient();
  }
  prisma = global.__db__;
}

export { prisma };
