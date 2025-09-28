import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EnrollmentService } from "./enrollment.service"
import { EnrollmentController } from "./enrollment.controller"
import { Enrollment } from "./entities/enrollment.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}

