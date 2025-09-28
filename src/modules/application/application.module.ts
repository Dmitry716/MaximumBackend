import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationService } from "./application.service"
import { ApplicationController } from "./application.controller"
import { Application } from "./entities/application.entity"
import { GroupStudent } from "../group/entities/group-student.entity"
import { User } from "../user/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Application, GroupStudent, User])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule { }

