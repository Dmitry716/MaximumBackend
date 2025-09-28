import { IsString, IsNumber, IsOptional, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateLessonDto {
  @IsString()
  @ApiProperty({ description: "Lesson title" })
  title: string

  @IsString()
  @ApiProperty({ description: "Lesson content" })
  content: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Lesson video URL", required: false })
  videoUrl?: string

  @IsNumber()
  @Min(1)
  @ApiProperty({ description: "Lesson order in the course" })
  order: number

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: "Estimated duration in minutes" })
  durationMinutes: number

  @IsNumber()
  @ApiProperty({ description: "Course ID" })
  courseId: number
}

