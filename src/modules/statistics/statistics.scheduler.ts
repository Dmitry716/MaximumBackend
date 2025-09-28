import { Inject, forwardRef, Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { StatisticsService } from "./statistics.service"

@Injectable()
export class StatisticsScheduler {
  private readonly logger = new Logger(StatisticsScheduler.name);


  constructor(
    @Inject(forwardRef(() => StatisticsService))
    private readonly statisticsService: StatisticsService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyStatistics() {
    this.logger.log("Generating daily statistics...")
    try {
      await this.statisticsService.generateDailyStatistics()
      this.logger.log("Daily statistics generated successfully")
    } catch (error) {
      this.logger.error(`Failed to generate daily statistics: ${error.message}`, error.stack)
    }
  }
}

