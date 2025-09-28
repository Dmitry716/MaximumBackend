import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Message } from "./message.entity"

@Entity("message_attachments")
export class MessageAttachment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Attachment unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "File URL" })
  fileUrl: string

  @ManyToOne(
    () => Message,
    (message) => message.attachments,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "messageId" })
  message: Message

  @Column()
  messageId: number
}

