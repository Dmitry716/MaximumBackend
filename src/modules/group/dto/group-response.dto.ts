import { ApiProperty } from "@nestjs/swagger"

export class GroupScheduleResponseDto {
  @ApiProperty({ description: "Schedule ID" })
  id: number

  @ApiProperty({ description: "Day of week" })
  dayOfWeek: string

  @ApiProperty({ description: "Start time" })
  startTime: string

  @ApiProperty({ description: "End time", required: false })
  endTime?: string
}

export class GroupStudentResponseDto {
  @ApiProperty({ description: "Student ID" })
  id: number

  @ApiProperty({ description: "Student name" })
  name: string

  @ApiProperty({ description: "Student email" })
  email: string

  @ApiProperty({ description: "Join date" })
  joinedAt: Date
}

export class GroupResponseDto {
  @ApiProperty({ description: "Group ID" })
  id: number

  @ApiProperty({ description: "Group number" })
  groupNumber: string

  @ApiProperty({ description: "Age range", required: false })
  ageRange?: string

  @ApiProperty({ description: "Maximum number of students" })
  maxStudents: number

  @ApiProperty({ description: "Current number of students" })
  currentStudents: number

  @ApiProperty({ description: "Course" })
  course: {
    id: number
    name: string
  }

  @ApiProperty({ description: "Group schedule", type: [GroupScheduleResponseDto] })
  schedule: GroupScheduleResponseDto[]

  @ApiProperty({ description: "Group students", type: [GroupStudentResponseDto] })
  students: GroupStudentResponseDto[]

  @ApiProperty({ description: "Group creation date" })
  createdAt: Date

  @ApiProperty({ description: "Group last update date" })
  updatedAt: Date
}

