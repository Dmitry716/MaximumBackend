import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Course } from "../../course/entities/course.entity"
import { CategoryStatus } from "../enums/category-status.enum"

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Category unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Category name" })
  name: string

  @Column("text")
  @ApiProperty({ description: "Category URL" })
  url: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Category description", required: false })
  description: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Category short description", required: false })
  shortDescription: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Category image URL", required: false })
  image: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Category color", required: false })
  color: string

  @Column({
    type: "enum",
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  @ApiProperty({
    description: "Category status",
    enum: CategoryStatus,
    example: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus

  @OneToMany(
    () => Course,
    (course) => course.category,
    {
      nullable: true,
      onDelete: "SET NULL"
    }
  )
  @ApiProperty({ description: "Courses in this category", type: [Course] })
  courses: Course[]

  @CreateDateColumn()
  @ApiProperty({ description: "Category creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Category last update timestamp" })
  updatedAt: Date
}

