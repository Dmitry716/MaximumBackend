import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FileService } from "./file.service"
import { FileController } from "./file.controller"
import { File } from "./entities/file.entity"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule.forRoot(), // Убедитесь, что ConfigModule настроен правильно
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

