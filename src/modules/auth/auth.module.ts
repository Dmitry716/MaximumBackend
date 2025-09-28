import { Module, forwardRef } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UserModule } from "../user/user.module"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { RefreshToken } from "./entities/refresh-token.entity"

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([RefreshToken]), forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

