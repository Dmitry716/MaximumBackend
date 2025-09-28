import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Course } from "../../course/entities/course.entity"

@Entity("completion_statistics")
export class CompletionStatistics {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Completion statistics unique identifier" })
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
  @ApiProperty({ description: "Number of completions" })
  completions: number
}

