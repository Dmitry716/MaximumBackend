import { ApiProperty } from "@nestjs/swagger"

export class CompletionStatisticsResponseDto {
  @ApiProperty({ description: "Completion statistics ID" })
  id: number

  @ApiProperty({ description: "Statistics date" })
  date: Date

  @ApiProperty({ description: "Course", required: false })
  course?: {
    id: number
    name: string
  }

  @ApiProperty({ description: "Number of completions" })
  completions: number
}

