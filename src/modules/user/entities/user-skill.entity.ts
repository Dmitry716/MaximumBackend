import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "./user.entity"

@Entity("user_skills")
export class UserSkill {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Skill unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Skill name" })
  skill: string

  @ManyToOne(
    () => User,
    (user) => user.skills,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: number
}

