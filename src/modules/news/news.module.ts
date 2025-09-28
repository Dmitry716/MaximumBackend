import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { NewsService } from "./news.service"
import { NewsController } from "./news.controller"
import { News } from "./entities/news.entity"
import { User } from "../user/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([News, User])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}

