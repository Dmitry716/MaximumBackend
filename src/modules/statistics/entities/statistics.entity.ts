import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

@Entity("statistics")
export class Statistics {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Statistics unique identifier" })
  id: number

  @Column({ type: "date" })
  @ApiProperty({ description: "Statistics date" })
  date: Date

  @Column({ default: 0 })
  @ApiProperty({ description: "Total number of students" })
  totalStudents: number

  @Column({ default: 0 })
  @ApiProperty({ description: "Number of active courses" })
  activeCourses: number

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: "Total revenue" })
  totalRevenue: number

  @Column("decimal", { precision: 5, scale: 2, default: 0 })
  @ApiProperty({ description: "Completion rate" })
  completionRate: number

  @CreateDateColumn()
  @ApiProperty({ description: "Statistics creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Statistics last update timestamp" })
  updatedAt: Date
}

