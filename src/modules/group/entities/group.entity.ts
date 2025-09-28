import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Course } from "../../course/entities/course.entity"
import { GroupSchedule } from "./group-schedule.entity"
import { GroupStudent } from "./group-student.entity"

@Entity("groups")
export class Group {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Group unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Group number" })
  groupNumber: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Age range", required: false })
  ageRange: string

  @Column({ default: 15 })
  @ApiProperty({ description: "Maximum number of students" })
  maxStudents: number

  @Column({ default: 0 })
  @ApiProperty({ description: "Current number of students" })
  currentStudents: number

  @ManyToOne(
    () => Course,
    (course) => course.groups,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: "courseId" })
  course: Course

  @Column()
  courseId: number

  @OneToMany(
    () => GroupSchedule,
    (schedule) => schedule.group,
    { cascade: true },
  )
  schedule: GroupSchedule[]

  @OneToMany(
    () => GroupStudent,
    (student) => student.group,
    { onDelete: "CASCADE" },
  )
  students: GroupStudent[]

  @CreateDateColumn()
  @ApiProperty({ description: "Group creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Group last update timestamp" })
  updatedAt: Date
}

