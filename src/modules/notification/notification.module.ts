import { Global, Module, forwardRef } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { NotificationService } from "./notification.service"
import { NotificationProcessor } from "./notification.processor"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { UserModule } from "../user/user.module"
import { GenericNotificationListener } from "./listeners/generic.listener"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Notification } from "./entities/notification.entity"
import { NotificationController } from "./notification.controller"

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST", "localhost"),
          port: parseInt(configService.get("REDIS_PORT", "6379"), 10),
          password: configService.get('REDIS_PASSWORD'),
          tls: {
            rejectUnauthorized: false,
          },
          maxRetriesPerRequest: 3,
          connectTimeout: 5000,
          enableReadyCheck: false,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: "notifications",
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [NotificationService, NotificationProcessor, GenericNotificationListener],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule { }

