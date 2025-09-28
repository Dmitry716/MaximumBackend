import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { ForumThread } from "./forum-thread.entity"

@Entity("forum_posts")
export class ForumPost {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Post unique identifier" })
  id: number

  @Column("text")
  @ApiProperty({ description: "Post content" })
  content: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "authorId" })
  @ApiProperty({ description: "Post author" })
  author: User

  @Column()
  authorId: number

  @ManyToOne(
    () => ForumThread,
    (thread) => thread.posts,
  )
  @JoinColumn({ name: "threadId" })
  @ApiProperty({ description: "Thread this post belongs to" })
  thread: ForumThread

  @Column()
  threadId: number

  @CreateDateColumn()
  @ApiProperty({ description: "Post creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Post last update timestamp" })
  updatedAt: Date
}

