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
import { NewsStatus } from "../enums/news-status.enum"

@Entity("news")
export class News {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "News unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "News title" })
  title: string

  @Column("text")
  @ApiProperty({ description: "News content" })
  content: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "authorId" })
  @ApiProperty({ description: "News author", required: false })
  author: User

  @Column("text")
  @ApiProperty({ description: "News URL" })
  url: string

  @Column({ nullable: true })
  authorId: number

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "News date" })
  date: Date

  @Column({ nullable: true })
  @ApiProperty({ description: "Course meta title for SEO", required: false })
  metaTitle: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course meta description for SEO", required: false })
  metaDescription: string

  @Column("text", { nullable: true })
  @ApiProperty({ description: "Course keywords for SEO", required: false })
  keywords: string

  @Column({ nullable: true })
  @ApiProperty({ description: "News image URL", required: false })
  image: string

  @Column({ nullable: true })
  @ApiProperty({ description: "News category", required: false })
  category: string

  @Column({
    type: "enum",
    enum: NewsStatus,
    default: NewsStatus.DRAFT,
  })
  @ApiProperty({
    description: "News status",
    enum: NewsStatus,
    example: NewsStatus.DRAFT,
  })
  status: NewsStatus

  @CreateDateColumn()
  @ApiProperty({ description: "News creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "News last update timestamp" })
  updatedAt: Date
}

