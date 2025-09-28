import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { LessonService } from "./lesson.service"
import type { CreateLessonDto } from "./dto/create-lesson.dto"
import type { UpdateLessonDto } from "./dto/update-lesson.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { Public } from "../auth/decorators/public.decorator"

@ApiTags("lessons")
@Controller("lessons")
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({ status: 201, description: 'The lesson has been successfully created.' })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  @Public() // Делаем эндпоинт публичным
  @ApiOperation({ summary: "Get all lessons" })
  @ApiResponse({ status: 200, description: "Return all lessons." })
  findAll(@Query('courseId') courseId: number) {
    return this.lessonService.findAll(courseId);
  }

  @Get(':id')
  @Public() // Делаем эндпоинт публичным
  @ApiOperation({ summary: 'Get a lesson by id' })
  @ApiResponse({ status: 200, description: 'Return the lesson.' })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a lesson" })
  @ApiResponse({ status: 200, description: "The lesson has been successfully updated." })
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'The lesson has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}

