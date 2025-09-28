import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { User } from "./entities/user.entity"
import { NotificationModule } from "../notification/notification.module"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => NotificationModule), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

