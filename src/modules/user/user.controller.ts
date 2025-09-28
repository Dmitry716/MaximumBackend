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
  HttpStatus,
  HttpCode,
  Req,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserResponseDto } from "./dto/user-response.dto"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "./enums/user-role.enum"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request & { user: { role: UserRole; id: number } },
  ) {

    const currentUser = req.user;

    if (createUserDto.role) {
      if (currentUser.role === UserRole.ADMIN && createUserDto.role === UserRole.SUPER_ADMIN) {
        throw new ForbiddenException("Админ не может создать роль супер админ");
      }
    }
    if (createUserDto.role) {
      if (currentUser.role === UserRole.ADMIN && createUserDto.role === UserRole.ADMIN) {
        throw new ForbiddenException("Админ не может создать роль админ");
      }
    }


    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns all users.",
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized.",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden resource.",
  })
  async findAll(@Query('role') role?: UserRole) {    
    return this.userService.findAll({ role });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: HttpStatus.OK, description: "User has been successfully updated.", type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input data." })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized." })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: { role: UserRole; id: number } },
  ) {
    const currentUser = req.user;

    if (updateUserDto.role) {
      if (currentUser.role === UserRole.ADMIN && updateUserDto.role === UserRole.SUPER_ADMIN) {
        throw new ForbiddenException("У вас нет права назначать суперадмин");
      }
      if (currentUser.role === UserRole.ADMIN && updateUserDto.role === UserRole.ADMIN) {
        throw new ForbiddenException("У вас нет права назначать админ");
      }

      if (
        currentUser.role !== UserRole.SUPER_ADMIN &&
        currentUser.role !== UserRole.ADMIN
      ) {
        throw new ForbiddenException("У вас нет разрешения на смену ролей");
      }
    }

    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: number; role: UserRole } },
  ) {
    const currentUser = req.user;

    const targetUser = await this.userService.findOne(+id);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.role === UserRole.ADMIN) {
      const forbiddenRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
      if (forbiddenRoles.includes(targetUser.role)) {
        throw new ForbiddenException('Администратор не может удалять других администраторов или суперадминов.');
      }
    }

    await this.userService.remove(+id);
  }

}

