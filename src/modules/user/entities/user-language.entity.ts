import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "./user.entity"

@Entity("user_languages")
export class UserLanguage {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Language unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Language name" })
  language: string

  @ManyToOne(
    () => User,
    (user) => user.languages,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: number
}

