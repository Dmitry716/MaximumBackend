import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Group } from "./group.entity"
import { User } from "../../user/entities/user.entity"
import { Application } from "src/modules/application/entities/application.entity"

@Entity("group_students")
export class GroupStudent {
  @PrimaryColumn()
  groupId: number

  @PrimaryColumn()
  studentId: number

  @ManyToOne(
    () => Group,
    (group) => group.students,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "groupId" })
  group: Group

  @ManyToOne(() => Application, { onDelete: "CASCADE" })
  @JoinColumn({ name: "applicationId" })
  application: Application;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student: User

  @CreateDateColumn()
  @ApiProperty({ description: "Join date" })
  joinedAt: Date
}

