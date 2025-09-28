import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { MessageStatus } from "../enums/message-status.enum"
import { MessageAttachment } from "./message-attachment.entity"

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Message unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Sender name" })
  senderName: string

  @Column()
  @ApiProperty({ description: "Sender email" })
  senderEmail: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Sender phone", required: false })
  senderPhone: string

  @Column()
  @ApiProperty({ description: "Message subject" })
  subject: string

  @Column("text")
  @ApiProperty({ description: "Message content" })
  content: string

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "Message date" })
  date: Date

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.NEW,
  })
  @ApiProperty({
    description: "Message status",
    enum: MessageStatus,
    example: MessageStatus.NEW,
  })
  status: MessageStatus

  @OneToMany(
    () => MessageAttachment,
    (attachment) => attachment.message,
    { cascade: true },
  )
  attachments: MessageAttachment[]

  @CreateDateColumn()
  @ApiProperty({ description: "Message creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Message last update timestamp" })
  updatedAt: Date
}

