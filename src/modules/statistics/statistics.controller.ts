import { Controller, Get, Query, UseGuards, ParseIntPipe, Optional, BadRequestException } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { StatisticsService } from "./statistics.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { StatisticsResponseDto } from "./dto/statistics-response.dto"
import { EnrollmentStatisticsResponseDto } from "./dto/enrollment-statistics-response.dto"
import { RevenueStatisticsResponseDto } from "./dto/revenue-statistics-response.dto"
import { CompletionStatisticsResponseDto } from "./dto/completion-statistics-response.dto"
import { DashboardStatisticsDto } from "./dto/dashboard-statistics.dto"
import { ParseDatePipe } from "../../common/pipes/parse-date.pipe"

@ApiTags("statistics")
@Controller("statistics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  @ApiResponse({
    status: 200,
    description: "Return dashboard statistics.",
    type: DashboardStatisticsDto,
  })
  getDashboardStatistics(
    @Query('userId') userId: number
  ) {
  return this.statisticsService.getDashboardStatistics(userId)
}

@Get("general")
@ApiOperation({ summary: "Get general statistics" })
@ApiResponse({
  status: 200,
  description: "Return general statistics.",
  type: [StatisticsResponseDto],
})
@ApiQuery({ name: "startDate", required: false, type: Date })
@ApiQuery({ name: "endDate", required: false, type: Date })
getGeneralStatistics(
  @Query('startDate', new ParseDatePipe({ optional: true })) startDate ?: Date,
  @Query('endDate', new ParseDatePipe({ optional: true })) endDate ?: Date,
) {
  return this.statisticsService.getGeneralStatistics(startDate, endDate)
}

@Get("enrollments")
@ApiOperation({ summary: "Get enrollment statistics" })
@ApiResponse({
  status: 200,
  description: "Return enrollment statistics.",
  type: [EnrollmentStatisticsResponseDto],
})
@ApiQuery({ name: "courseId", required: false, type: Number })
@ApiQuery({ name: "startDate", required: false, type: Date })
@ApiQuery({ name: "endDate", required: false, type: Date })
getEnrollmentStatistics(
  @Query('courseId', new ParseIntPipe({ optional: true })) courseId ?: number,
  @Query('startDate', new ParseDatePipe({ optional: true })) startDate ?: Date,
  @Query('endDate', new ParseDatePipe({ optional: true })) endDate ?: Date,
) {
  return this.statisticsService.getEnrollmentStatistics(courseId, startDate, endDate)
}

@Get("revenue")
@ApiOperation({ summary: "Get revenue statistics" })
@ApiResponse({
  status: 200,
  description: "Return revenue statistics.",
  type: [RevenueStatisticsResponseDto],
})
@ApiQuery({ name: "courseId", required: false, type: Number })
@ApiQuery({ name: "startDate", required: false, type: Date })
@ApiQuery({ name: "endDate", required: false, type: Date })
getRevenueStatistics(
  @Query('courseId', new ParseIntPipe({ optional: true })) courseId ?: number,
  @Query('startDate', new ParseDatePipe({ optional: true })) startDate ?: Date,
  @Query('endDate', new ParseDatePipe({ optional: true })) endDate ?: Date,
) {
  return this.statisticsService.getRevenueStatistics(courseId, startDate, endDate)
}

@Get("completions")
@ApiOperation({ summary: "Get completion statistics" })
@ApiResponse({
  status: 200,
  description: "Return completion statistics.",
  type: [CompletionStatisticsResponseDto],
})
@ApiQuery({ name: "courseId", required: false, type: Number })
@ApiQuery({ name: "startDate", required: false, type: Date })
@ApiQuery({ name: "endDate", required: false, type: Date })
getCompletionStatistics(
  @Query('courseId') courseId ?: string,
  @Query('startDate') startDate ?: string,
  @Query('endDate') endDate ?: string,
) {
  const courseIdNum = courseId ? Number(courseId) : undefined;
  if (courseId && isNaN(courseIdNum)) {
    throw new BadRequestException('courseId must be a number');
  }
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;
  return this.statisticsService.getCompletionStatistics(courseIdNum, start, end);
}
}

