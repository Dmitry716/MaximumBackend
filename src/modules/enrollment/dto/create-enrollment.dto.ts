import { IsNumber, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { EnrollmentStatus } from "../enums/enrollment-status.enum"

export class CreateEnrollmentDto {
  @IsNumber()
  @ApiProperty({ description: "User ID" })
  userId: number

  @IsNumber()
  @ApiProperty({ description: "Course ID" })
  courseId: number

  @IsEnum(EnrollmentStatus)
  @ApiProperty({ description: "Enrollment status", enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  status: EnrollmentStatus = EnrollmentStatus.ACTIVE
}

