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
import { Lesson } from "../../lesson/entities/lesson.entity"
import { QuizQuestion } from "./quiz-question.entity"

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Quiz unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Quiz title" })
  title: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Quiz description", required: false })
  description: string

  @Column({ default: 0 })
  @ApiProperty({ description: "Time limit in minutes (0 for no limit)" })
  timeLimit: number

  @Column({ default: 60 })
  @ApiProperty({ description: "Passing score percentage" })
  passingScore: number

  @Column({ default: true })
  @ApiProperty({ description: "Whether to show correct answers after submission" })
  showCorrectAnswers: boolean

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Course this quiz belongs to", required: false })
  course: Course

  @Column({ nullable: true })
  courseId: number

  @ManyToOne(() => Lesson, { nullable: true })
  @JoinColumn({ name: "lessonId" })
  @ApiProperty({ description: "Lesson this quiz belongs to", required: false })
  lesson: Lesson

  @Column({ nullable: true })
  lessonId: number

  @OneToMany(
    () => QuizQuestion,
    (question) => question.quiz,
    { cascade: true },
  )
  @ApiProperty({ description: "Quiz questions", type: [QuizQuestion] })
  questions: QuizQuestion[]

  @CreateDateColumn()
  @ApiProperty({ description: "Quiz creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Quiz last update timestamp" })
  updatedAt: Date
}

