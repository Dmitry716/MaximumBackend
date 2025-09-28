import { Injectable, NotFoundException, ConflictException, Logger, Inject, forwardRef } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { User } from "./entities/user.entity"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import type { UserRole } from "./enums/user-role.enum"
import { NotificationService } from "../notification/notification.service"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { UserStatus } from "./enums/user-status.enum"

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private eventEmitter: EventEmitter2
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with the same email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    const savedUser = await this.usersRepository.save(user)

    // Send welcome email
    try {
      await this.notificationService.sendWelcomeEmail(savedUser.id, savedUser.email)
    } catch (error) {
      this.logger.error(`Failed to send welcome email: ${error.message}`)
    }

    this.logger.log(`Created new user with email: ${user.email}`)
    return savedUser
  }

  async findAll(options: {
    role?: UserRole
  }): Promise<User[]> {
    const { role } = options
    const queryBuilder = this.usersRepository.createQueryBuilder("user")

    if (role) {
      queryBuilder.where(
        "user.status = :status AND user.role = :role",
        { status: UserStatus.ACTIVE, role }
      );
    }

    return queryBuilder.orderBy("user.createdAt", "DESC").getMany()
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`)
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    // If updating email, check if the new email is already in use
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      })

      if (existingUser) {
        throw new ConflictException("User with this email already exists")
      }
    }

    if (user.role !== "teacher" && updateUserDto.role === "teacher") {
      this.eventEmitter.emit(`user.updated`, {
        entity: "user",
        data: user,
        eventName: 'user.updated',
      });
    }

    // If updating password, hash it
    if (updateUserDto.password && updateUserDto.oldPassword) {
      const check = await bcrypt.compare(updateUserDto.oldPassword, user.password)
      if (!check) {
        throw new ConflictException("Old password is incorrect")
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    // Update the user
    Object.assign(user, updateUserDto)

    this.logger.log(`Updated user with ID: ${id}`)
    return this.usersRepository.save(user)
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id)

    await this.usersRepository.remove(user)
    this.logger.log(`Deleted user with ID: ${id}`)
  }
}

