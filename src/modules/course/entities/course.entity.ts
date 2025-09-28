import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { Category } from "../../category/entities/category.entity"
import { Lesson } from "../../lesson/entities/lesson.entity"
import { Enrollment } from "../../enrollment/entities/enrollment.entity"
import { CourseStatus } from "../enums/course-status.enum"
import { Group } from "../../group/entities/group.entity"
import { Image } from "./images.entity"

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Course unique identifr" })
  id: number

  @Column()
  @ApiProperty({ description: "Course name" })
  name: string
  @Column()

  @ApiProperty({ description: "Course heading" })
  heading: string

  @Column("text")
  @ApiProperty({ description: "Course description" })
  description: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course detailed description", required: false })
  detailedDescription: string

  @Column("decimal", { precision: 10, scale: 2 })
  @ApiProperty({ description: "Course price" })
  price: number

  @Column("text")
  @ApiProperty({ description: "Course URL" })
  url: string
  
  @Column()
  @ApiProperty({ description: 'Course duration (e.g., "4 weeks")' })
  duration: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Course level", required: false })
  level: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Course color", required: false })
  color: string

  @Column({
    type: "enum",
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  @ApiProperty({
    description: "Course status",
    enum: CourseStatus,
    example: CourseStatus.DRAFT,
  })
  status: CourseStatus

  @Column({ default: true })
  @ApiPropertyOptional({ description: 'Is the user isShow?', example: true })
  isShow: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: "Course meta title for SEO", required: false })
  metaTitle: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course meta description for SEO", required: false })
  metaDescription: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course keywords for SEO", required: false })
  keywords: string

  @ManyToOne(
    () => Category,
    (category) => category.courses,
    {
      nullable: true,
      onDelete: "SET NULL"
    }
  )
  @JoinColumn({ name: "categoryId" })
  @ApiProperty({ description: "Course category" })
  category: Category

  @OneToMany(() => Image, image => image.course, { cascade: true, eager: true })
  images: Image[];

  @Column({ nullable: true })
  categoryId: number

  @ManyToOne(
    () => User,
    (user) => user.coursesTeaching,
    { nullable: true }
  )
  @JoinColumn({ name: "instructorId" })
  @ApiProperty({ description: "Course instructor" })
  instructor: User

  @Column({ nullable: true })
  instructorId: number

  @OneToMany(
    () => Lesson,
    (lesson) => lesson.course,
    { onDelete: 'CASCADE' }
  )
  @ApiProperty({ description: "Course lessons", type: [Lesson] })
  lessons: Lesson[]

  @ApiPropertyOptional({ description: 'Total number of students across all groups', required: false })
  studentCount?: number;

  @OneToMany(
    () => Enrollment,
    (enrollment) => enrollment.course,
    { onDelete: 'CASCADE' }
  )
  enrollments: Enrollment[]

  @OneToMany(
    () => Group,
    (group) => group.course,
    { onDelete: 'CASCADE' }
  )
  groups: Group[]

  @CreateDateColumn()
  @ApiProperty({ description: "Course creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Course last update timestamp" })
  updatedAt: Date
}

