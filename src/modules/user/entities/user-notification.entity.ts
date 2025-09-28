import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "./user.entity"

@Entity("user_notifications")
export class UserNotification {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Notification setting unique identifier" })
  id: number

  @Column({ default: true })
  @ApiProperty({ description: "Email notification enabled" })
  email: boolean

  @Column({ default: false })
  @ApiProperty({ description: "SMS notification enabled" })
  sms: boolean

  @Column({ default: true })
  @ApiProperty({ description: "Push notification enabled" })
  push: boolean

  @ManyToOne(
    () => User,
    (user) => user.notificationSettings,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: number
}

