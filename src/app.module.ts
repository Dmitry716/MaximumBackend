import { Module } from "@nestjs/common"
import { CacheModule } from "@nestjs/cache-manager"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ThrottlerModule } from "@nestjs/throttler"
import { ScheduleModule } from "@nestjs/schedule"
import { BullModule } from "@nestjs/bull"
import { APP_FILTER, APP_GUARD } from "@nestjs/core"
import { CoreModule } from "./modules/core/core.module"
import { JwtGlobalModule } from "./modules/jwt/jwt.module"
import { UserModule } from "./modules/user/user.module"
import { AuthModule } from "./modules/auth/auth.module"
import { CourseModule } from "./modules/course/course.module"
import { CategoryModule } from "./modules/category/category.module"
import { LessonModule } from "./modules/lesson/lesson.module"
import { EnrollmentModule } from "./modules/enrollment/enrollment.module"
import { ApplicationModule } from "./modules/application/application.module"
import { StatisticsModule } from "./modules/statistics/statistics.module"
import { FileModule } from "./modules/file/file.module"
import { NotificationModule } from "./modules/notification/notification.module"
import { GroupModule } from "./modules/group/group.module"
import { NewsModule } from "./modules/news/news.module"
import { BlogModule } from "./modules/blog/blog.module"
import { MessageModule } from "./modules/message/message.module"
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard"
import { RolesGuard } from "./modules/auth/guards/roles.guard"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { databaseConfig } from "./config/database.config"
import { authConfig } from "./config/auth.config"
import { appConfig } from "./config/app.config"
import { EventEmitterModule } from "@nestjs/event-emitter"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
    }),

    EventEmitterModule.forRoot({
      wildcard: true,  
      global: true,
      delimiter: '.',
    }),

    // Core module
    CoreModule,

    // JWT module
    JwtGlobalModule,

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get("THROTTLE_TTL", 60),
        limit: configService.get("THROTTLE_LIMIT", 10),
      }),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: +configService.get<number>("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: process.env.TYPEORM_SYNC === 'true',
        logging: configService.get("DB_LOGGING") === "true",
        retryAttempts: 5,
        retryDelay: 3000,
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Queue processing
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST", "localhost"),
          port: configService.get("REDIS_PORT", 6379),
          password: configService.get('REDIS_PASSWORD'),
          tls: { rejectUnauthorized: false },
        },
      }),
    }),

    // Кэширование
    CacheModule.register({
      ttl: 60 * 60 * 24, // 24 hours
      isGlobal: true,
    }),

    // Feature modules
    UserModule,
    AuthModule,
    CourseModule,
    CategoryModule,
    LessonModule,
    EnrollmentModule,
    ApplicationModule,
    StatisticsModule,
    FileModule,
    NotificationModule,
    GroupModule,
    NewsModule,
    BlogModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }

