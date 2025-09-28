import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException, Put } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { BlogService } from "./blog.service"
import { CreateBlogPostDto } from "./dto/create-blog-post.dto"
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto"
import { BlogPostResponseDto } from "./dto/blog-post-response.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { Public } from "../auth/decorators/public.decorator"

@ApiTags("blog")
@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'The blog post has been successfully created.',
    type: BlogPostResponseDto
  })
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all blog posts" })
  @ApiResponse({
    status: 200,
    description: "Return all blog posts.",
    type: [BlogPostResponseDto],
  })
  findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10, 
    @Query('status') status?: string,
    @Query('categoryName') categoryName?: string,
    @Query('excludeBlogId') excludeBlogId?: string,
  ) {
    return this.blogService.findAll(page, limit, status, categoryName, +excludeBlogId)
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a blog post by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the blog post.',
    type: BlogPostResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Get('url/:url')
  @Public() 
  @ApiOperation({ summary: 'Get a blog post by url' })
  @ApiResponse({ status: 200, description: 'Return the blog post.' })
  findOneByName(@Param('url') url: string) {
    return this.blogService.findOneByUrl(url);
  }

  // get blog only by editor
  @Get('/editor/:id')
  @Roles(UserRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all blog posts by teacher" })
  @ApiResponse({
    status: 200,
    description: "Return all blog posts by teacher.",
    type: [BlogPostResponseDto],
  })
  findAllByTeacher(
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string
  ) {
    return this.blogService.findAllByTeacher(+id, +page, +limit, status)
  }

  @Get('seo/:pageName') // GET /api/blog/seo/courses
  @Public() // или нужна авторизация?
  @ApiOperation({ summary: 'Get SEO data for a general page (e.g., /courses, /blog, /news)' })
  @ApiResponse({
    status: 200,
    description: 'Return SEO data if found, otherwise null.',
    // type: BlogPostResponseDto // или специальный DTO для SEO
  })
  @ApiResponse({
    status: 404, // или 204 No Content
    description: 'SEO data not found for the given pageName.',
  })
  async getSeoByPageName(@Param('pageName') pageName: string) {
    const seoData = await this.blogService.findSeoByPageName(pageName);
    if (!seoData) {
      // Вариант 1: Вернуть 204 No Content
      // throw new NotFoundException('SEO data not found'); // Это вызовет 404
      // Вариант 2: Вернуть 200 OK с null
      return null; // Frontend будет обрабатывать null
    }
    return seoData; // Возвращаем найденные данные
  }

  // Новый эндпоинт для обновления/создания SEO-данных
  @Put('seo/:pageName') // PUT /api/blog/seo/courses
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN) // Уточните роли
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update or create SEO data for a general page (e.g., /courses, /blog, /news)' })
  @ApiResponse({
    status: 200,
    description: 'SEO data updated or created successfully.',
    type: BlogPostResponseDto // или специальный DTO
  })
  async upsertSeoData(
    @Param('pageName') pageName: string,
    @Body() seoDto: Partial<UpdateBlogPostDto> // Используем частичный DTO или создайте новый для SEO
  ) {
    // Проверим, является ли pageName допустимым (опционально)
    const validPageNames = ['home', 'courses', 'blog', 'news', 'about', 'contact']; // Добавьте другие
    if (!validPageNames.includes(pageName)) {
      throw new BadRequestException(`Invalid pageName: ${pageName}`);
    }

    const result = await this.blogService.upsertSeoData(pageName, seoDto);
    return result;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a blog post" })
  @ApiResponse({
    status: 200,
    description: "The blog post has been successfully updated.",
    type: BlogPostResponseDto,
  })
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(+id, updateBlogPostDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 200, description: 'The blog post has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
  
}

