import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Course } from "../../course/entities/course.entity"

@Entity("revenue_statistics")
export class RevenueStatistics {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Revenue statistics unique identifier" })
  id: number

  @Column({ type: "date" })
  @ApiProperty({ description: "Statistics date" })
  date: Date

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' },)
  @JoinColumn({ name: "courseId" })
  course: Course

  @Column({ nullable: true })
  courseId: number

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: "Revenue amount" })
  revenue: number
}

