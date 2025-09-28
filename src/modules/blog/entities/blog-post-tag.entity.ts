import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { BlogPost } from "./blog-post.entity"

@Entity("blog_post_tags")
export class BlogPostTag {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Tag unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Tag name" })
  tag: string

  @ManyToOne(
    () => BlogPost,
    (post) => post.tags,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "postId" })
  post: BlogPost

  @Column()
  postId: number
}

