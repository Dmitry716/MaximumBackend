import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, Get, Param, Delete } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { FileService } from "./file.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { UploadFileDto } from "./dto/upload-file.dto"
import { GetUser } from "../auth/decorators/get-user.decorator"
import { User } from "../user/entities/user.entity"
import { Express } from "express"
import { FileType } from "./enums/file-type.enum"
import { multerOptions } from "./multer.options"

@ApiTags("files")
@Controller("files")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file",multerOptions))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The file to be uploaded",
        },
        fileType: {
          type: "string",
          enum: Object.values(FileType),
          description: "Type of the file (e.g., course_material, user_avatar)",
          example: FileType.COURSE_MATERIAL,
        },
        entityId: {
          type: "number",
          description: "Optional related entity ID (e.g., course ID)",
          example: 123,
        },
        entityType: {
          type: "string",
          description: "Optional related entity type (e.g., 'course', 'lesson')",
          example: "course",
        },
      },
      required: ["file", "fileType"],
    },
  })
  @ApiOperation({ summary: "Upload a file" })
  @ApiResponse({ status: 201, description: "The file has been successfully uploaded." })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @GetUser() user: User,
  ) {
    return this.fileService.uploadFile(file, uploadFileDto, user);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a file by id' })
  @ApiResponse({ status: 200, description: 'Return the file.' })
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'The file has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}

