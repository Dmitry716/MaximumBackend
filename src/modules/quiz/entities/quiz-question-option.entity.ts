import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { QuizQuestion } from "./quiz-question.entity"

@Entity("quiz_question_options")
export class QuizQuestionOption {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Option unique identifier" })
  id: number

  @Column("text")
  @ApiProperty({ description: "Option text" })
  text: string

  @Column()
  @ApiProperty({ description: "Whether this option is correct" })
  isCorrect: boolean

  @ManyToOne(
    () => QuizQuestion,
    (question) => question.options,
  )
  question: QuizQuestion
}

