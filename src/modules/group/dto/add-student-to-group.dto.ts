import { IsNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AddStudentToGroupDto {
  @IsNumber()
  @ApiProperty({ description: "Student ID" })
  studentId: number
}

