import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Course unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Image URL" })
  url: string

  @IsOptional()
  @Column()
  @ApiProperty({ description: "Video url" })
  videoUrl?: string

  @ManyToOne(() => Course, course => course.images, {
    onDelete: "CASCADE",
  })
  
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Course this image belongs to" })
  course: Course;
  
}