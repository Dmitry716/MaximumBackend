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
import { ApplicationStatus } from "../enums/application-status.enum"
import { Group } from "src/modules/group/entities/group.entity"

@Entity("applications")
export class Application {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Application unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Child name" })
  childName: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Child age", required: false })
  age: number

  @Column()
  @ApiProperty({ description: "Parent phone number" })
  parentPhone: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Parent email", required: false })
  parentEmail: string

  @ManyToOne(() => Course, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Course applied for", required: false })
  course: Course

  @Column({ nullable: true })
  courseId: number

  @ManyToOne(() => Group, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "groupId" })
  @ApiProperty({ description: "Group applied for", required: false })
  group: Group

  @Column({ nullable: true })
  groupId: number

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "Application date" })
  date: Date

  @Column({
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.NEW,
  })
  @ApiProperty({
    description: "Application status",
    enum: ApplicationStatus,
    example: ApplicationStatus.NEW,
  })
  status: ApplicationStatus

  @Column({ nullable: true })
  @ApiProperty({ description: "Child photo URL", required: false })
  photo: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Application message", required: false })
  message: string

  @ManyToOne(
    () => User,
    (user) => user.applications,
    { nullable: true },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ nullable: true })
  userId: number

  @CreateDateColumn()
  @ApiProperty({ description: "Application creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Application last update timestamp" })
  updatedAt: Date
}

