import { ApiProperty } from "@nestjs/swagger"
import { CourseStatus } from "../enums/course-status.enum"

export class CourseResponseDto {
  @ApiProperty({ description: "Course ID" })
  id: number

  @ApiProperty({ description: "Course name" })
  name: string

  @ApiProperty({ description: "Course description" })
  description: string

  @ApiProperty({ description: "Course URL" })
  url: string

  @ApiProperty({ description: "Course detailed description", required: false })
  detailedDescription?: string

  @ApiProperty({ description: "Course category" })
  category: {
    id: number
    name: string
  }

  @ApiProperty({ description: "Course price" })
  price: number

  @ApiProperty({ description: "Course duration" })
  duration: string

  @ApiProperty({ description: "Course level", required: false })
  level?: string

  @ApiProperty({ description: "Course image URL", required: false })
  image?: string

  @ApiProperty({ description: "Course instructor" })
  instructor: {
    id: number
    name: string
  }

  @ApiProperty({ description: "Number of students enrolled" })
  students: number

  @ApiProperty({ description: "Course status", enum: CourseStatus })
  status: CourseStatus

  @ApiProperty({ description: "Course color", required: false })
  color?: string

  @ApiProperty({ description: "Course groups", type: [Object], required: false })
  groups?: {
    id: number
    groupNumber: string
    ageRange?: string
    schedule: {
      [key: string]: { start: string; end: string } | null
    }
    maxStudents: number
    currentStudents: number
  }[]

  @ApiProperty({ description: "Course meta title for SEO", required: false })
  metaTitle?: string

  @ApiProperty({ description: "Course meta description for SEO", required: false })
  metaDescription?: string

  @ApiProperty({ description: "Course keywords for SEO", required: false })
  keywords?: string

  @ApiProperty({ description: "Course creation date" })
  createdAt: Date

  @ApiProperty({ description: "Course last update date" })
  updatedAt: Date
}

