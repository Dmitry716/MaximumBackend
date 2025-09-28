import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupService } from "./group.service"
import { GroupController } from "./group.controller"
import { Group } from "./entities/group.entity"
import { GroupSchedule } from "./entities/group-schedule.entity"
import { GroupStudent } from "./entities/group-student.entity"
import { User } from "../user/entities/user.entity"
import { Course } from "../course/entities/course.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupSchedule, GroupStudent, User, Course])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}

