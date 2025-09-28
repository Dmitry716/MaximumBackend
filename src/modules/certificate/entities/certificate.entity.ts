import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { Course } from "../../course/entities/course.entity"

@Entity("certificates")
export class Certificate {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Certificate unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Certificate unique code" })
  code: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  @ApiProperty({ description: "User who earned the certificate" })
  user: User

  @Column()
  userId: number

  @ManyToOne(() => Course)
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Course the certificate is for" })
  course: Course

  @Column()
  courseId: number

  @Column()
  @ApiProperty({ description: "Certificate PDF file URL" })
  fileUrl: string

  @Column({ default: false })
  @ApiProperty({ description: "Whether the certificate has been downloaded" })
  isDownloaded: boolean

  @CreateDateColumn()
  @ApiProperty({ description: "Certificate issue date" })
  issueDate: Date
}

