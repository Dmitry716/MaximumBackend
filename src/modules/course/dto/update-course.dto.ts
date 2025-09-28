import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsBoolean, IsObject, IsArray, ValidateNested } from "class-validator";
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { CourseStatus } from "../enums/course-status.enum";
import { Type } from "class-transformer";
import { ImageDto } from "./images.dto";

export class UpdateCourseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Course name" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Course url" })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Course description" })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "Course price" })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Course duration (e.g., "4 weeks")' })
  duration: string;

  @IsNotEmpty()
  @IsEnum(CourseStatus)
  @ApiProperty({ description: "Course status", enum: CourseStatus })
  status: CourseStatus;

  @IsNotEmpty()
  @ApiProperty({ description: "Course category ID" })
  categoryId: number;

  @IsOptional()
  @ApiProperty({ description: "Course instructor ID" })
  instructorId: number;

  // Optional fields
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course detailed description" })
  detailedDescription?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course level" })
  level?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course heading" })
  heading?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Is the user isShow?', example: true })
  isShow?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @ApiPropertyOptional({ type: [ImageDto], description: "List of images (with optional videoUrl)" })
  images?: ImageDto[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course color" })
  color?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course meta title for SEO" })
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course meta description for SEO" })
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course keywords for SEO" })
  keywords?: string;
}
