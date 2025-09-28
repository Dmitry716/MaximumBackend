import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BlogService } from "./blog.service"
import { BlogController } from "./blog.controller"
import { BlogPost } from "./entities/blog-post.entity"
import { BlogPostTag } from "./entities/blog-post-tag.entity"
import { User } from "../user/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogPostTag, User])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}

