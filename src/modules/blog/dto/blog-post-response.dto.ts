import { ApiProperty } from "@nestjs/swagger"
import { BlogPostStatus } from "../enums/blog-post-status.enum"

export class BlogPostResponseDto {
  @ApiProperty({ description: "Blog post ID" })
  id: number

  @ApiProperty({ description: "Blog post title" })
  title: string

  @ApiProperty({ description: "Blog post content" })
  content: string

  @ApiProperty({ description: "Blog post author", required: false })
  author?: {
    id: number
    name: string
    avatar?: string
  }

  @ApiProperty({ description: "Blog post date" })
  date: Date

  @ApiProperty({ description: "Course URL" })
  url: string

  @ApiProperty({ description: "Blog post images URL", required: false })
  images?: string[]

  @ApiProperty({ description: "Blog post category", required: false })
  category?: string

  @ApiProperty({ description: "Blog post status", enum: BlogPostStatus })
  status: BlogPostStatus

  @ApiProperty({ description: "Blog post tags", type: [String] })
  tags: string[]

  @ApiProperty({ description: "Blog post creation date" })
  createdAt: Date

  @ApiProperty({ description: "Blog post last update date" })
  updatedAt: Date
}

