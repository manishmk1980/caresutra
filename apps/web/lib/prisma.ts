import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. PrismaClient cannot be initialized."
    )
  }

  const adapter = new PrismaMariaDb(url)

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })
}

export function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const client = createPrismaClient()

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = {
  get customerRecord() {
    return getPrisma().customerRecord
  },
  get customerActivity() {
    return getPrisma().customerActivity
  },
  get appointmentRequest() {
    return getPrisma().appointmentRequest
  },
} as Pick<PrismaClient, "customerRecord" | "customerActivity" | "appointmentRequest">
