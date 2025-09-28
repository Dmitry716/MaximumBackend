import { ApiProperty } from "@nestjs/swagger"
import { CategoryStatus } from "../enums/category-status.enum"

export class CategoryResponseDto {
  @ApiProperty({ description: "Category ID" })
  id: number

  @ApiProperty({ description: "Category name" })
  name: string

  @ApiProperty({ description: "Category description", required: false })
  description?: string

  @ApiProperty({ description: "Category URL" })
  url: string

  @ApiProperty({ description: "Category short description", required: false })
  shortDescription?: string

  @ApiProperty({ description: "Category image URL", required: false })
  image?: string

  @ApiProperty({ description: "Category color", required: false })
  color?: string

  @ApiProperty({ description: "Category status", enum: CategoryStatus })
  status: CategoryStatus

  @ApiProperty({ description: "Number of courses in this category" })
  courses: number

  @ApiProperty({ description: "Number of students in this category" })
  students: number

  @ApiProperty({ description: "Category creation date" })
  createdAt: Date

  @ApiProperty({ description: "Category last update date" })
  updatedAt: Date
}

