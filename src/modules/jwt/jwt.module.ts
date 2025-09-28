import { Module, Global } from "@nestjs/common"
import { JwtModule as NestJwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("auth.jwtSecret", "secret"),
        signOptions: {
          expiresIn: configService.get("auth.jwtExpiresIn", "1h"),
        },
      }),
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtGlobalModule {}

