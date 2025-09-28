import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger"
import { GroupService } from "./group.service"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { AddStudentToGroupDto } from "./dto/add-student-to-group.dto"
import { GroupResponseDto } from "./dto/group-response.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { Public } from "../auth/decorators/public.decorator"

@ApiTags("groups")
@Controller("groups")
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The group has been successfully created.',
    type: GroupResponseDto
  })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Get all groups" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all groups.",
    type: [GroupResponseDto],
  })
  @ApiQuery({ name: "courseId", required: false, type: Number })
  findAll(@Query('courseId') courseId?: number) {
    return this.groupService.findAll(courseId);
  }

  @Get('age-ranges')
  @Public()
  @ApiOperation({ summary: 'Get unique age ranges' })
  async getAgeRanges(): Promise<string[]> {
    return this.groupService.getUniqueAgeRanges();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get a group by id' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the group.',
    type: GroupResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Update a group" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The group has been successfully updated.",
    type: GroupResponseDto,
  })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The group has been successfully deleted.'
  })
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }

  @Post(":id/students")
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Add a student to a group" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The student has been successfully added to the group.",
    type: GroupResponseDto,
  })
  addStudent(@Param('id') id: string, @Body() addStudentDto: AddStudentToGroupDto) {
    return this.groupService.addStudent(+id, addStudentDto.studentId)
  }

  @Delete(":id/students/:studentId")
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Remove a student from a group" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiParam({ name: "studentId", description: "Student ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The student has been successfully removed from the group.",
    type: GroupResponseDto,
  })
  removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.groupService.removeStudent(+id, +studentId)
  }

  @Get(":id/students")
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Get all students in a group" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all students in the group.",
  })
  getStudents(@Param('id') id: string) {
    return this.groupService.getStudents(+id);
  }
}

