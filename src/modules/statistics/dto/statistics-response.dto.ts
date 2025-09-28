import { ApiProperty } from "@nestjs/swagger"

export class StatisticsResponseDto {
  @ApiProperty({ description: "Statistics ID" })
  id: number

  @ApiProperty({ description: "Statistics date" })
  date: Date

  @ApiProperty({ description: "Total number of students" })
  totalStudents: number

  @ApiProperty({ description: "Number of active courses" })
  activeCourses: number

  @ApiProperty({ description: "Total revenue" })
  totalRevenue: number

  @ApiProperty({ description: "Completion rate" })
  completionRate: number

  @ApiProperty({ description: "Statistics creation date" })
  createdAt: Date

  @ApiProperty({ description: "Statistics last update date" })
  updatedAt: Date
}

