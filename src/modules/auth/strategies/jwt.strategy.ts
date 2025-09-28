import { Injectable, UnauthorizedException, Inject, forwardRef } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UserService } from "../../user/user.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "secret",
    })
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findOne(payload.sub)
      return user
    } catch (error) {
      throw new UnauthorizedException("Invalid token")
    }
  }
}

