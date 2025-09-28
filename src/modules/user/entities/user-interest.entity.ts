import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "./user.entity"

@Entity("user_interests")
export class UserInterest {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Interest unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Interest name" })
  interest: string

  @ManyToOne(
    () => User,
    (user) => user.interests,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: number
}

