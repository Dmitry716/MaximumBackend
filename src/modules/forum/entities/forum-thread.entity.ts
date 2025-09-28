import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { ForumCategory } from "./forum-category.entity"
import { ForumPost } from "./forum-post.entity"

@Entity("forum_threads")
export class ForumThread {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Thread unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Thread title" })
  title: string

  @Column({ default: false })
  @ApiProperty({ description: "Whether the thread is pinned" })
  isPinned: boolean

  @Column({ default: false })
  @ApiProperty({ description: "Whether the thread is locked" })
  isLocked: boolean

  @ManyToOne(() => User)
  @JoinColumn({ name: "authorId" })
  @ApiProperty({ description: "Thread author" })
  author: User

  @Column()
  authorId: number

  @ManyToOne(
    () => ForumCategory,
    (category) => category.threads,
  )
  @JoinColumn({ name: "categoryId" })
  @ApiProperty({ description: "Category this thread belongs to" })
  category: ForumCategory

  @Column()
  categoryId: number

  @OneToMany(
    () => ForumPost,
    (post) => post.thread,
  )
  @ApiProperty({ description: "Posts in this thread", type: [ForumPost] })
  posts: ForumPost[]

  @Column({ default: 0 })
  @ApiProperty({ description: "View count" })
  viewCount: number

  @CreateDateColumn()
  @ApiProperty({ description: "Thread creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Thread last update timestamp" })
  updatedAt: Date
}

