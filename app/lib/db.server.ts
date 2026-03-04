import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import path from "path";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient | undefined;
}

function createPrismaClient() {
  // Resolve the SQLite database path relative to project root
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const dbPath = dbUrl.replace("file:", "").replace(/^\.\//, "");
  const absoluteDbPath = path.resolve(process.cwd(), dbPath);

  const adapter = new PrismaBetterSqlite3({ url: absoluteDbPath });
  return new PrismaClient({ adapter });
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
