import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { ActivityType } from "../enums/activity-type.enum"

@Entity("user_activities")
export class UserActivity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Activity unique identifier" })
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  @ApiProperty({ description: "User who performed the activity" })
  user: User

  @Column()
  userId: number

  @Column({
    type: "enum",
    enum: ActivityType,
  })
  @ApiProperty({
    description: "Type of activity",
    enum: ActivityType,
  })
  activityType: ActivityType

  @Column("json", { nullable: true })
  @ApiProperty({ description: "Additional activity data", required: false })
  metadata: Record<string, any>

  @Column({ nullable: true })
  @ApiProperty({ description: "Related entity ID (course, lesson, etc.)", required: false })
  entityId: number

  @Column({ nullable: true })
  @ApiProperty({ description: "Related entity type", required: false })
  entityType: string

  @CreateDateColumn()
  @ApiProperty({ description: "Activity timestamp" })
  timestamp: Date
}

