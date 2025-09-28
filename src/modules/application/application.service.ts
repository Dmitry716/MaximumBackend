import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Application } from "./entities/application.entity"
import type { CreateApplicationDto } from "./dto/create-application.dto"
import type { UpdateApplicationDto } from "./dto/update-application.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { ApplicationStatus } from "./enums/application-status.enum"
import { User } from "../user/entities/user.entity"
import { GroupStudent } from "../group/entities/group-student.entity"
import { UserRole } from "../user/enums/user-role.enum"
import { UserStatus } from "../user/enums/user-status.enum"

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(GroupStudent)
    private readonly groupStudentRepository: Repository<GroupStudent>,
    private eventEmitter: EventEmitter2
  ) { }

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto)
    return await this.applicationRepository.save(application)
  }

  async createApplicationUserGroup(dto: CreateApplicationDto) {
    const { childName, parentPhone, parentEmail, groupId } = dto

    if (!groupId) {
      throw new BadRequestException('Group ID is required')
    }

    const user = this.userRepository.create({
      name: childName,
      phone: parentPhone,
      email: parentEmail ?? `user_${Date.now()}@placeholder.com`,
      password: 'defaultPassword',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    })

    await this.userRepository.save(user)

    const groupStudent = this.groupStudentRepository.create({
      groupId,
      studentId: user.id,
    })

    await this.groupStudentRepository.save(groupStudent)

    return {
      message: 'User created and assigned to group',
      userId: user.id,
      groupId,
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ items: Application[]; total: number }> {
    const [items, total] = await this.applicationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ["user", "course", "group"],
      order: {
        createdAt: "DESC",
      },
    })

    return { items, total }
  }

  async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ["user", "course"],
    })
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`)
    }
    return application
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto, adminId: number): Promise<Application> {
    const application = await this.findOne(id);

    if (application.status !== ApplicationStatus.CONFIRMED && updateApplicationDto.status === ApplicationStatus.CONFIRMED) {
      this.eventEmitter.emit(`application.status`, {
        entity: "application",
        data: { ...updateApplicationDto, adminId },
        eventName: 'application.status',
      })
    }

    if (updateApplicationDto.courseId !== undefined) {
      application.course = { id: updateApplicationDto.courseId } as any;
    }

    if (updateApplicationDto.status === ApplicationStatus.CONFIRMED) {
      if (!application.userId) {
        const isUser = await this.userRepository.findOne({
          where: { email: updateApplicationDto.parentEmail },
        })

        if (isUser) {
          application.user = isUser
          application.userId = isUser.id
        } else {
          const user = this.userRepository.create({
            name: updateApplicationDto.childName,
            phone: updateApplicationDto.parentPhone,
            email: updateApplicationDto.parentEmail ?? `user_${Date.now()}@placeholder.com`,
            password: 'defaultPassword',
            role: UserRole.STUDENT,
            status: UserStatus.ACTIVE,
          })
          await this.userRepository.save(user)

          application.user = user
          application.userId = user.id
        }

      }

      if (updateApplicationDto.groupId !== undefined &&
        updateApplicationDto.groupId !== application.group?.id) {
        const newGroup = { id: updateApplicationDto.groupId } as any;
        application.group = newGroup;

        const oldGroupStudent = await this.groupStudentRepository.findOne({
          where: {
            application: { id: application.id },
          },
          relations: ['application'],
        });

        if (oldGroupStudent) {
          await this.groupStudentRepository.remove(oldGroupStudent);
        }

        const newGroupStudent = this.groupStudentRepository.create({
          group: newGroup,
          student: application.user,
          application: application,
        });

        await this.groupStudentRepository.save(newGroupStudent);

        this.eventEmitter.emit(`application.status`, {
          entity: "application",
          data: { ...updateApplicationDto, adminId },
          eventName: 'application.status',
        })
      }
    }


    Object.assign(application, updateApplicationDto)
    return await this.applicationRepository.save(application)
  }

  async remove(id: number): Promise<void> {
    const result = await this.applicationRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Application with ID ${id} not found`)
    }
  }
}

