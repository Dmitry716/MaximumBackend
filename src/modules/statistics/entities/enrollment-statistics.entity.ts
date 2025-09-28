import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Course } from "../../course/entities/course.entity"

@Entity("enrollment_statistics")
export class EnrollmentStatistics {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Enrollment statistics unique identifier" })
  id: number

  @Column({ type: "date" })
  @ApiProperty({ description: "Statistics date" })
  date: Date

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "courseId" })
  course: Course

  @Column({ nullable: true })
  courseId: number

  @Column({ default: 0 })
  @ApiProperty({ description: "Number of enrollments" })
  enrollments: number
}

