import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CategoryService } from "./category.service"
import { CategoryController } from "./category.controller"
import { Category } from "./entities/category.entity"
import { Reflector } from "@nestjs/core"

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    Reflector, // Явно предоставляем Reflector
  ],
  exports: [CategoryService],
})
export class CategoryModule {}

