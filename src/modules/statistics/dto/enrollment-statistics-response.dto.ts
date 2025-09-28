import { ApiProperty } from "@nestjs/swagger"

export class EnrollmentStatisticsResponseDto {
  @ApiProperty({ description: "Enrollment statistics ID" })
  id: number

  @ApiProperty({ description: "Statistics date" })
  date: Date

  @ApiProperty({ description: "Course", required: false })
  course?: {
    id: number
    name: string
  }

  @ApiProperty({ description: "Number of enrollments" })
  enrollments: number
}

