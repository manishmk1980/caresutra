import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let prismaInstance: PrismaClient | null = null;

/**
 * Returns a singleton PrismaClient (Prisma ORM 7+ requires a driver adapter for MySQL).
 * Uses `@prisma/adapter-mariadb` with the `mariadb` driver — compatible with `mysql://` URLs.
 * Throws if DATABASE_URL is not set.
 */
export function getPrisma(): PrismaClient {
  if (prismaInstance) return prismaInstance;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set. PrismaClient cannot be initialized.");
  }
  const adapter = new PrismaMariaDb(url);
  prismaInstance = new PrismaClient({ adapter });
  return prismaInstance;
}

