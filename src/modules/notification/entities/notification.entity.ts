import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { NotificationType } from "../enums/notification-type.enum"

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Notification unique identifier" })
  id: number

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  @ApiProperty({ description: "User who received the notification" })
  user: User

  @Column()
  userId: number

  @Column()
  @ApiProperty({ description: "Notification title" })
  title: string

  @Column("text")
  @ApiProperty({ description: "Notification message" })
  message: string

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  @ApiProperty({
    description: "Notification type",
    enum: NotificationType,
  })
  type: NotificationType

  @Column({ default: false })
  @ApiProperty({ description: "Whether the notification has been read" })
  isRead: boolean

  @Column({ default: false })
  @ApiProperty({ description: "Whether the notification has been read" })
  isReadAdmin: boolean

  @Column({ nullable: true })
  @ApiProperty({ description: "Related entity ID (course, lesson, etc.)", required: false })
  entityId: number

  @Column({ nullable: true })
  @ApiProperty({ description: "Related entity type", required: false })
  entityType: string

  @CreateDateColumn()
  @ApiProperty({ description: "Notification creation timestamp" })
  createdAt: Date
}

