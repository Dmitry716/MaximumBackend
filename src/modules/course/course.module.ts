import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CacheModule } from "@nestjs/cache-manager"
import { CourseService } from "./course.service"
import { CourseController } from "./course.controller"
import { Course } from "./entities/course.entity"
import { GroupStudent } from "../group/entities/group-student.entity"
import { Image } from "./entities/images.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Course, GroupStudent, Image]), CacheModule.register()],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule { }

