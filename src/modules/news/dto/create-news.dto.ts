import { IsString, IsOptional, IsEnum, IsNumber, IsNotEmpty } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { NewsStatus } from "../enums/news-status.enum"

export class CreateNewsDto {
  @IsString()
  @ApiProperty({ description: "News title" })
  title: string

  @IsString()
  @ApiProperty({ description: "News content" })
  content: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Course url" })
  url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "News image URL", required: false })
  image?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "News category", required: false })
  category?: string

  @IsEnum(NewsStatus)
  @ApiProperty({
    description: "News status",
    enum: NewsStatus,
    default: NewsStatus.DRAFT,
  })
  status: NewsStatus = NewsStatus.DRAFT

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "Author ID", required: false })
  authorId?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "News meta title for SEO" })
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "News meta description for SEO" })
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "News keywords for SEO" })
  keywords?: string;
}

