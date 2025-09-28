import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Message } from "./entities/message.entity"
import { MessageAttachment } from "./entities/message-attachment.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageAttachment])],
  controllers: [],
  providers: [],
  exports: [],
})
export class MessageModule {}

