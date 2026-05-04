import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

/**
 * Returns a singleton PrismaClient instance.
 * Throws an error if DATABASE_URL is not set.
 */
export function getPrisma(): PrismaClient {
  if (prismaInstance) return prismaInstance;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set. PrismaClient cannot be initialized.');
  }
  prismaInstance = new PrismaClient();
  return prismaInstance;
}

