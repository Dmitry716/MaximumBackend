import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { FileType } from "../enums/file-type.enum"

@Entity("files")
export class File {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "File unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Original file name" })
  originalName: string

  @Column()
  @ApiProperty({ description: "File storage path or URL" })
  path: string

  @Column()
  @ApiProperty({ description: "File MIME type" })
  mimeType: string

  @Column()
  @ApiProperty({ description: "File size in bytes" })
  size: number

  @Column({
    type: "enum",
    enum: FileType,
  })
  @ApiProperty({
    description: "File type/category",
    enum: FileType,
  })
  fileType: FileType

  @Column({ nullable: true })
  @ApiProperty({ description: "Related entity ID (course, lesson, etc.)", required: false })
  entityId: number

  @Column({ nullable: true })
  @ApiProperty({ description: "Related entity type", required: false })
  entityType: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "uploadedById" })
  @ApiProperty({ description: "User who uploaded the file" })
  uploadedBy: User

  @Column()
  uploadedById: number

  @CreateDateColumn()
  @ApiProperty({ description: "File upload timestamp" })
  uploadedAt: Date
}

