import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, Max } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { CreateGroupScheduleDto } from "./create-group-schedule.dto"

export class CreateGroupDto {
  @IsString()
  @ApiProperty({ description: "Group number" })
  groupNumber: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Age range", required: false })
  ageRange?: string

  @IsNumber()
  @Min(1)
  @Max(100, { message: "maxStudents::Max students must be between 1 and 100" })
  @ApiProperty({ description: "Maximum number of students", default: 15 })
  maxStudents = 15

  @IsNumber()
  @ApiProperty({ description: "Course ID" })
  courseId: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGroupScheduleDto)
  @ApiProperty({
    description: "Group schedule",
    type: [CreateGroupScheduleDto],
    required: false,
  })
  schedule?: CreateGroupScheduleDto[]
}

