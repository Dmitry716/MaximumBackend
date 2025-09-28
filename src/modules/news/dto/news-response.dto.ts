import { ApiProperty } from "@nestjs/swagger"
import { NewsStatus } from "../enums/news-status.enum"

export class NewsResponseDto {
  @ApiProperty({ description: "News ID" })
  id: number

  @ApiProperty({ description: "News title" })
  title: string

  @ApiProperty({ description: "News content" })
  content: string

  @ApiProperty({ description: "Course URL" })
  url: string

  @ApiProperty({ description: "News author", required: false })
  author?: {
    id: number
    name: string
    avatar?: string
  }

  @ApiProperty({ description: "News date" })
  date: Date

  @ApiProperty({ description: "News image URL", required: false })
  image?: string

  @ApiProperty({ description: "News category", required: false })
  category?: string

  @ApiProperty({ description: "News status", enum: NewsStatus })
  status: NewsStatus

  @ApiProperty({ description: "News creation date" })
  createdAt: Date

  @ApiProperty({ description: "News last update date" })
  updatedAt: Date
}

