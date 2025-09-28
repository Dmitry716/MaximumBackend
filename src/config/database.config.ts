import { registerAs } from "@nestjs/config"

export const databaseConfig = registerAs("database", () => ({
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "educational_platform",
  synchronize: false, // Отключаем автоматическую синхронизацию
  logging: process.env.DB_LOGGING === "true",
}))