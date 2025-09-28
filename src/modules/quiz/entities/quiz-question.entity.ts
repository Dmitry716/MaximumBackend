import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Quiz } from "./quiz.entity"
import { QuizQuestionOption } from "./quiz-question-option.entity"
import { QuestionType } from "../enums/question-type.enum"

@Entity("quiz_questions")
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Question unique identifier" })
  id: number

  @Column("text")
  @ApiProperty({ description: "Question text" })
  text: string

  @Column({
    type: "enum",
    enum: QuestionType,
    default: QuestionType.SINGLE_CHOICE,
  })
  @ApiProperty({
    description: "Question type",
    enum: QuestionType,
    example: QuestionType.SINGLE_CHOICE,
  })
  type: QuestionType

  @Column({ default: 1 })
  @ApiProperty({ description: "Points awarded for correct answer" })
  points: number

  @Column()
  @ApiProperty({ description: "Question order in the quiz" })
  order: number

  @ManyToOne(
    () => Quiz,
    (quiz) => quiz.questions,
  )
  @JoinColumn({ name: "quizId" })
  @ApiProperty({ description: "Quiz this question belongs to" })
  quiz: Quiz

  @Column()
  quizId: number

  @OneToMany(
    () => QuizQuestionOption,
    (option) => option.question,
    { cascade: true },
  )
  @ApiProperty({ description: "Question options", type: [QuizQuestionOption] })
  options: QuizQuestionOption[]
}

