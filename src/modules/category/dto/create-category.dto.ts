import { IsString, IsOptional, IsNumber, Min, IsBoolean, IsEnum } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { CategoryStatus } from "../enums/category-status.enum";

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ description: "Category name" })
  name: string

  @IsString()
  @ApiProperty({ description: "Category URL" })
  url: string

  @IsOptional()
  @IsEnum(CategoryStatus)
  @ApiPropertyOptional({ description: 'User status', enum: CategoryStatus, example: CategoryStatus.ACTIVE })
  status?: CategoryStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Category description", required: false })
  description?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Category icon URL", required: false })
  icon?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: "Category display order", required: false, default: 0 })
  order?: number
}

