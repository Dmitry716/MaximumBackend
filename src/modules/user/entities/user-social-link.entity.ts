import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "./user.entity"

@Entity("user_social_links")
export class UserSocialLink {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Social link unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Social platform name" })
  platform: string

  @Column()
  @ApiProperty({ description: "Social profile URL" })
  url: string

  @ManyToOne(
    () => User,
    (user) => user.socialLinks,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: number
}

