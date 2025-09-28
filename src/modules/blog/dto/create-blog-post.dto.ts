import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsNotEmpty } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { BlogPostStatus } from "../enums/blog-post-status.enum"

export class CreateBlogPostDto {
  @IsString()
  @ApiProperty({ description: "Blog post title" })
  title: string

  @IsString()
  @ApiProperty({ description: "Blog post content" })
  content: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Course url" })
  url: string;

  @IsArray()
  @ApiProperty({ description: "Blog post images URL"})
  images?: string[]

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Blog post category", required: false })
  category?: string

  @IsEnum(BlogPostStatus)
  @ApiProperty({
    description: "Blog post status",
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus = BlogPostStatus.DRAFT

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "Blog post tags",
    type: [String],
    required: false,
  })
  tags?: string[]

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "Author ID", required: false })
  authorId?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Blog meta title for SEO" })
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Blog meta description for SEO" })
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Blog keywords for SEO" })
  keywords?: string;
}

