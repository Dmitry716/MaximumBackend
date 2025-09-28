import { registerAs } from "@nestjs/config"

export const appConfig = registerAs("app", () => ({
  port: Number.parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || "development",
  throttleTtl: Number.parseInt(process.env.THROTTLE_TTL, 10) || 60,
  throttleLimit: Number.parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
}))

