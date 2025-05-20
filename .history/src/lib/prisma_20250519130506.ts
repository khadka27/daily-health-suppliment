import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Add connection timeout settings for Neon
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Helper function to test database connection
export async function testDatabaseConnection() {
  try {
    // Try to query the database
    await prisma.$queryRaw`SELECT 1`
    return { connected: true, message: "Successfully connected to the database" }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      connected: false,
      message: "Failed to connect to the database",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
