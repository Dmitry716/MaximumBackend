import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { ForumThread } from "./forum-thread.entity"

@Entity("forum_categories")
export class ForumCategory {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Forum category unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Forum category name" })
  name: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Forum category description", required: false })
  description: string

  @Column({ default: 0 })
  @ApiProperty({ description: "Display order of the category" })
  order: number

  @OneToMany(
    () => ForumThread,
    (thread) => thread.category,
  )
  @ApiProperty({ description: "Threads in this category", type: [ForumThread] })
  threads: ForumThread[]

  @CreateDateColumn()
  @ApiProperty({ description: "Category creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Category last update timestamp" })
  updatedAt: Date
}

