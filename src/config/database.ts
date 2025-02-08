export const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction,
    connectionTimeoutMillis: isProduction ? 5000 : 10000,
    maxPoolSize: isProduction ? 10 : 2,
  }
}
