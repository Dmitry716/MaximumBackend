import { Injectable, UnauthorizedException, Logger, Inject, forwardRef } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { UserService } from "../user/user.service"
import type { User } from "../user/entities/user.entity"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"
import type { RefreshTokenDto } from "./dto/refresh-token.dto"
import { RefreshToken } from "./entities/refresh-token.entity"
import { UserRole } from "../user/enums/user-role.enum"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly jwtSecret = process.env.JWT_SECRET || "secret"
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || "2h"
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret"
  private readonly jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    this.logger.log('AuthService initialized');
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email)
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials")
      }

      return user
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials")
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    return this.generateTokens(user)
  }

  async register(registerDto: RegisterDto) {    
    const user = await this.userService.create({
      ...registerDto,
      role: UserRole.STUDENT,
    })    
    return this.generateTokens(user)
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken: token } = refreshTokenDto

    // Verify refresh token
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ["user"],
    })

    if (!refreshTokenEntity || refreshTokenEntity.revoked) {
      throw new UnauthorizedException("Invalid refresh token")
    }

    // Check if token is expired
    if (new Date() > refreshTokenEntity.expiresAt) {
      throw new UnauthorizedException("Refresh token expired")
    }

    // Generate new tokens
    const tokens = await this.generateTokens(refreshTokenEntity.user)

    // Revoke old refresh token
    refreshTokenEntity.revoked = true
    await this.refreshTokenRepository.save(refreshTokenEntity)

    return tokens
  }

  async logout(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    })

    if (tokenEntity) {
      tokenEntity.revoked = true
      await this.refreshTokenRepository.save(tokenEntity)
    }

    return { success: true }
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    // Generate access token
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn })

    // Generate refresh token
    const refreshToken = jwt.sign({ sub: user.id }, this.jwtRefreshSecret, { expiresIn: this.jwtRefreshExpiresIn })

    // Parse refresh token expiration
    const refreshExpiresInMs = this.parseJwtExpiresIn(this.jwtRefreshExpiresIn)

    // Store refresh token in database
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      user,
      expiresAt: new Date(Date.now() + refreshExpiresInMs),
    })

    await this.refreshTokenRepository.save(refreshTokenEntity)

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseJwtExpiresIn(this.jwtExpiresIn) / 1000, // Convert to seconds
      user,
    }
  }

  private parseJwtExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/)

    if (!match) {
      return 3600 * 1000 // Default to 1 hour
    }

    const value = Number.parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case "s":
        return value * 1000
      case "m":
        return value * 60 * 1000
      case "h":
        return value * 60 * 60 * 1000
      case "d":
        return value * 24 * 60 * 60 * 1000
      default:
        return value * 1000
    }
  }
}

