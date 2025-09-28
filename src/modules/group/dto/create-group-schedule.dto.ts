import { IsEnum, IsString, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { DayOfWeek } from "../enums/day-of-week.enum"

export class CreateGroupScheduleDto {
  @IsEnum(DayOfWeek)
  @ApiProperty({
    description: "Day of week",
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  dayOfWeek: DayOfWeek

  @IsString()
  @ApiProperty({
    description: "Start time (HH:MM format)",
    example: "09:00",
  })
  startTime: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "End time (HH:MM format)",
    example: "10:30",
    required: false,
  })
  endTime?: string
}

