import { ApiProperty } from "@nestjs/swagger"

export class RevenueStatisticsResponseDto {
  @ApiProperty({ description: "Revenue statistics ID" })
  id: number

  @ApiProperty({ description: "Statistics date" })
  date: Date

  @ApiProperty({ description: "Course", required: false })
  course?: {
    id: number
    name: string
  }

  @ApiProperty({ description: "Revenue amount" })
  revenue: number
}

