import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { NewsService } from "./news.service"
import { CreateNewsDto } from "./dto/create-news.dto"
import { UpdateNewsDto } from "./dto/update-news.dto"
import { NewsResponseDto } from "./dto/news-response.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { Public } from "../auth/decorators/public.decorator"

@ApiTags("news")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a news item' })
  @ApiResponse({
    status: 201,
    description: 'The news item has been successfully created.',
    type: NewsResponseDto
  })
  create(
    @Body() createNewsDto: CreateNewsDto,
    @Req() req: Request & { user: { id: number } }
  ) {
    return this.newsService.create({...createNewsDto, authorId: req.user.id});
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all news" })
  @ApiResponse({
    status: 200,
    description: "Return all news.",
    type: [NewsResponseDto],
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('categoryName') categoryName?: string,
    @Query('excludeNewsId') excludeNewsId?: string) {
    return this.newsService.findAll(page, limit, status,categoryName, +excludeNewsId)
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a news item by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the news item.',
    type: NewsResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Get('url/:url')
  @Public() 
  @ApiOperation({ summary: 'Get a blog post by url' })
  @ApiResponse({ status: 200, description: 'Return the blog post.' })
  findOneByName(@Param('url') url: string) {
    return this.newsService.findOneByUrl(url);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a news item" })
  @ApiResponse({
    status: 200,
    description: "The news item has been successfully updated.",
    type: NewsResponseDto,
  })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a news item' })
  @ApiResponse({ status: 200, description: 'The news item has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}

