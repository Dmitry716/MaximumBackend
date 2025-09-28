import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { StatisticsService } from "./statistics.service"
import { StatisticsController } from "./statistics.controller"
import { StatisticsScheduler } from "./statistics.scheduler"
import { Statistics } from "./entities/statistics.entity"
import { EnrollmentStatistics } from "./entities/enrollment-statistics.entity"
import { RevenueStatistics } from "./entities/revenue-statistics.entity"
import { CompletionStatistics } from "./entities/completion-statistics.entity"
import { UserActivity } from "./entities/user-activity.entity"
import { User } from "../user/entities/user.entity"
import { Course } from "../course/entities/course.entity"
import { Enrollment } from "../enrollment/entities/enrollment.entity"
import { Payment } from "../payment/entities/payment.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Statistics,
      EnrollmentStatistics,
      RevenueStatistics,
      CompletionStatistics,
      UserActivity,
      User,
      Course,
      Enrollment,
      Payment,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    {
      provide: StatisticsScheduler,
      useFactory: (statisticsService: StatisticsService) => {
        return new StatisticsScheduler(statisticsService)
      },
      inject: [StatisticsService],
    },
  ],
  exports: [StatisticsService],
})
export class StatisticsModule {}

