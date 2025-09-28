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
import { BlogPostStatus } from "../enums/blog-post-status.enum"
import { BlogPostTag } from "./blog-post-tag.entity"

@Entity("blog_posts")
export class BlogPost {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Blog post unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Blog post title" })
  title: string

  @Column("text")
  @ApiProperty({ description: "Blog post content" })
  content: string

  @Column("text")
  @ApiProperty({ description: "Blog URL" })
  url: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "authorId" })
  @ApiProperty({ description: "Blog post author", required: false })
  author: User

  @Column({ nullable: true })
  authorId: number

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "Blog post date" })
  date: Date

  @Column("json", { nullable: true })
  @ApiProperty({ description: "Blog post images URL", required: false })
  images?: string[]  
  
  @Column({ nullable: true })
  @ApiProperty({ description: "Blog post category", required: false })
  category: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Course meta title for SEO", required: false })
  metaTitle: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course meta description for SEO", required: false })
  metaDescription: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course keywords for SEO", required: false })
  keywords: string

  @Column({
    type: "enum",
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  @ApiProperty({
    description: "Blog post status",
    enum: BlogPostStatus,
    example: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus

  @OneToMany(
    () => BlogPostTag,
    (tag) => tag.post,
    { cascade: true },
  )
  tags: BlogPostTag[]

  @CreateDateColumn()
  @ApiProperty({ description: "Blog post creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Blog post last update timestamp" })
  updatedAt: Date
}

