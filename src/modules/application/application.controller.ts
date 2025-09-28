import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { ApplicationService } from "./application.service"
import { CreateApplicationDto } from "./dto/create-application.dto"
import { UpdateApplicationDto } from "./dto/update-application.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { Public } from "../auth/decorators/public.decorator"

@ApiTags("applications")
@Controller("applications")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 201, description: 'The application has been successfully created.' })

  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  // Create user, bind to course, bind to group
  @Post('user-course-group')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a user and bind to course and group' })
  @ApiResponse({ status: 201, description: 'The application has been successfully created.' })
  async createApplicationUserCourseGroup(@Body() createApplicationDto: CreateApplicationDto) {
    return await this.applicationService.createApplicationUserGroup(createApplicationDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all applications" })
  @ApiResponse({ status: 200, description: "Return all applications." })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.applicationService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an application by id' })
  @ApiResponse({ status: 200, description: 'Return the application.' })
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Update an application" })
  @ApiResponse({ status: 200, description: "The application has been successfully updated." })
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Req() req: Request & { user: { role: UserRole; id: number } },
  ) {
    return this.applicationService.update(+id, updateApplicationDto, req.user.id)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an application' })
  @ApiResponse({ status: 200, description: 'The application has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}

