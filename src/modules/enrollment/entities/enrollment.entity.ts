import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { Course } from "../../course/entities/course.entity"
import { EnrollmentStatus } from "../enums/enrollment-status.enum"

@Entity("enrollments")
export class Enrollment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Enrollment unique identifier" })
  id: number

  @ManyToOne(
    () => User,
    (user) => user.enrollments,
  )
  @JoinColumn({ name: "userId" })
  @ApiProperty({ description: "Enrolled user" })
  user: User

  @Column()
  userId: number

  @ManyToOne(
    () => Course,
    (course) => course.enrollments,
  )
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Enrolled course" })
  course: Course

  @Column()
  courseId: number

  @Column({
    type: "enum",
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  @ApiProperty({
    description: "Enrollment status",
    enum: EnrollmentStatus,
    example: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus

  @Column({ nullable: true })
  @ApiProperty({ description: "Completion percentage", required: false })
  completionPercentage: number

  @CreateDateColumn()
  @ApiProperty({ description: "Enrollment date" })
  enrollmentDate: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Enrollment last update timestamp" })
  updatedAt: Date
}

