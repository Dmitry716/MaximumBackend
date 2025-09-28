import { ApiProperty } from "@nestjs/swagger"

export class DashboardStatisticsDto {
  @ApiProperty({ description: "Total number of students" })
  totalStudents: number

  @ApiProperty({ description: "Total number of courses" })
  totalCourses: number

  @ApiProperty({ description: "Number of active courses" })
  activeCourses: number

  @ApiProperty({ description: "Total revenue" })
  totalRevenue: number

  @ApiProperty({ description: "Average completion rate" })
  averageCompletionRate: number

  @ApiProperty({ description: "New students this month" })
  newStudentsThisMonth: number

  @ApiProperty({ description: "Revenue this month" })
  revenueThisMonth: number

  @ApiProperty({ description: "Monthly CompletionAndEnrollment data" })
  monthlyCompletionAndEnrollment: {
    name: string
    enrollments: number
    completions: number
  }[]

  @ApiProperty({ description: "Monthly revenue data" })
  monthlyRevenue: {
    month: string
    amount: number
  }[]

  @ApiProperty({ description: "Top courses by enrollment" })
  topCoursesByEnrollment: {
    id: number
    name: string
    enrollments: number
  }[]

  @ApiProperty({ description: "Top courses by revenue" })
  topCoursesByRevenue: {
    id: number
    name: string
    revenue: number
  }[]

  @ApiProperty({ description: "Name" })
  courseEnrollmentStats: {
    name: string,
    color: string,
    value: number
  }[]
}

