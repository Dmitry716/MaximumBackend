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
import { Course } from "../../course/entities/course.entity"

@Entity("lessons")
export class Lesson {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Lesson unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Lesson title" })
  title: string

  @Column("text")
  @ApiProperty({ description: "Lesson content" })
  content: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Lesson video URL", required: false })
  videoUrl: string

  @Column()
  @ApiProperty({ description: "Lesson order in the course" })
  order: number

  @Column({ default: 0 })
  @ApiProperty({ description: "Estimated duration in minutes" })
  durationMinutes: number

  @ManyToOne(
    () => Course,
    (course) => course.lessons,
  )
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Course this lesson belongs to" })
  course: Course

  @Column()
  courseId: number

  @CreateDateColumn()
  @ApiProperty({ description: "Lesson creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Lesson last update timestamp" })
  updatedAt: Date
}

