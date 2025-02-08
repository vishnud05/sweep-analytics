import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient

// Edge runtime specific configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000, // Add timeout
  ssl: true, // Enable SSL for production
})

const adapter = new PrismaNeon(pool)

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter,
    log: ["error"], // Add logging for debugging
  })
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter })
  }
  prisma = global.cachedPrisma
}

export const db = prisma
