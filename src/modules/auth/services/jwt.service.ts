import { Injectable } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as jwt from "jsonwebtoken"

@Injectable()
export class CustomJwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: any, options?: jwt.SignOptions): string {
    const secret = this.configService.get("auth.jwtSecret", "secret")
    const defaultOptions: jwt.SignOptions = {
      expiresIn: this.configService.get("auth.jwtExpiresIn", "1h"),
    }

    return jwt.sign(payload, secret, { ...defaultOptions, ...options })
  }

  verify(token: string, options?: jwt.VerifyOptions): any {
    const secret = this.configService.get("auth.jwtSecret", "secret")
    return jwt.verify(token, secret, options)
  }
}

