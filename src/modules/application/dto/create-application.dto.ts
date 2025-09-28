import { IsNumber, IsString, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ApplicationStatus } from "../enums/application-status.enum"

export class CreateApplicationDto {
  @IsString()
  @ApiProperty({ description: "Child name" })
  childName: string

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "Child age", required: false })
  age?: number

  @IsString()
  @ApiProperty({ description: "Parent phone number" })
  parentPhone: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Parent email", required: false })
  parentEmail?: string

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "Course ID", required: false })
  courseId?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "Group ID", required: false })
  groupId?: number

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Application message", required: false })
  message?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Child photo URL", required: false })
  photo?: string

  @IsEnum(ApplicationStatus)
  @ApiProperty({ description: "Application status", enum: ApplicationStatus, default: ApplicationStatus.NEW })
  status: ApplicationStatus = ApplicationStatus.NEW
}

