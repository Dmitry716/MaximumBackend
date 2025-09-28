import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { EnrollmentService } from "./enrollment.service"
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto"
import { UpdateEnrollmentDto } from "./dto/update-enrollment.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"

@ApiTags("enrollments")
@Controller("enrollments")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({ status: 201, description: 'The enrollment has been successfully created.' })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: "Get all enrollments" })
  @ApiResponse({ status: 200, description: "Return all enrollments." })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.enrollmentService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an enrollment by id' })
  @ApiResponse({ status: 200, description: 'Return the enrollment.' })
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: "Update an enrollment" })
  @ApiResponse({ status: 200, description: "The enrollment has been successfully updated." })
  update(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentService.update(+id, updateEnrollmentDto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an enrollment' })
  @ApiResponse({ status: 200, description: 'The enrollment has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(+id);
  }
}

