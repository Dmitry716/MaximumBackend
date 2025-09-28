import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Group } from "./group.entity"
import { DayOfWeek } from "../enums/day-of-week.enum"

@Entity("group_schedule")
export class GroupSchedule {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Schedule unique identifier" })
  id: number

  @Column({
    type: "enum",
    enum: DayOfWeek,
  })
  @ApiProperty({ description: "Day of week", enum: DayOfWeek })
  dayOfWeek: DayOfWeek

  @Column({ type: "time", nullable: true })
  @ApiProperty({ description: "Start time", required: false })
  startTime: string

  @Column({ type: "time", nullable: true })
  @ApiProperty({ description: "End time", required: false })
  endTime: string

  @ManyToOne(
    () => Group,
    (group) => group.schedule,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "groupId" })
  group: Group

  @Column()
  groupId: number
}

