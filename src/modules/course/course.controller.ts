import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, DefaultValuePipe, ParseArrayPipe, ParseIntPipe } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { CourseService } from "./course.service"
import { CreateCourseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Public } from "../auth/decorators/public.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { Roles } from "../auth/decorators/roles.decorator"
import { normalizeToArray } from "src/common/filters/normalise-array"

@ApiTags("courses")
@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'The course has been successfully created.' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get("all")
  @Public()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Return filtered list of courses.' })
  findAll() {
    return this.courseService.findAll();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all courses with optional filters' })
  @ApiResponse({ status: 200, description: 'Return filtered list of courses.' })
  @ApiQuery({
    name: 'categories',
    required: false,
    description: 'Send category IDs separated by commas (array).',
    type: 'string',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price (number).',
    type: 'number',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price (number).',
    type: 'number',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    description: 'Course level (string).',
    type: 'string',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query (case-insensitive)',
    type: 'string',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)' })
  findAllPublic(
    @Query('categories') rawCategories: string | string[] | undefined,
    @Query('minPrice', new DefaultValuePipe(undefined)) minPrice: number | undefined,
    @Query('maxPrice', new DefaultValuePipe(undefined)) maxPrice: number | undefined,
    @Query('level', new DefaultValuePipe(undefined)) level: string | undefined,
    @Query('search', new DefaultValuePipe(undefined)) search: string | undefined,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const categoriesStrArray = normalizeToArray(rawCategories);

    const categories = categoriesStrArray
      .map((v) => Number(v))
      .filter((num) => !isNaN(num));

    return this.courseService.findAllPublic({
      categories,
      minPrice,
      maxPrice,
      level,
      search,
      limit,
      page,
    });
  }

  @Get(':id')
  @Public() 
  @ApiOperation({ summary: 'Get a course by id' })
  @ApiResponse({ status: 200, description: 'Return the course.' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Get('name/:name')
  @Public() 
  @ApiOperation({ summary: 'Get a course by name' })
  @ApiResponse({ status: 200, description: 'Return the course.' })
  findOneByName(@Param('name') name: string) {
    return this.courseService.findOneByName(name);
  }

  // findAllByInstructor
  @Get('instructor/:instructorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all courses by instructor' })
  @ApiResponse({ status: 200, description: 'Return all courses by instructor.' })
  findAllByInstructor(@Param('instructorId') instructorId: string) {
    return this.courseService.findAllByInstructor(+instructorId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a course" })
  @ApiResponse({ status: 200, description: "The course has been successfully updated." })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'The course has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }

  @Get(':id/groups')
  @Public() // Делаем эндпоинт публичным
  @ApiOperation({ summary: 'Get course groups' })
  @ApiResponse({ status: 200, description: 'Return the course groups.' })
  findGroups(@Param('id') id: string) {
    return this.courseService.findGroups(+id);
  }
}

