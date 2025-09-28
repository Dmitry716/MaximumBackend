import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Group } from "./entities/group.entity"
import { GroupSchedule } from "./entities/group-schedule.entity"
import { GroupStudent } from "./entities/group-student.entity"
import { User } from "../user/entities/user.entity"
import { Course } from "../course/entities/course.entity"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { UserRole } from "../user/enums/user-role.enum"

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(GroupSchedule)
    private groupScheduleRepository: Repository<GroupSchedule>,
    @InjectRepository(GroupStudent)
    private groupStudentRepository: Repository<GroupStudent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>
  ) { }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    // Check if course exists
    const course = await this.courseRepository.findOne({
      where: { id: createGroupDto.courseId },
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${createGroupDto.courseId} not found`)
    }

    // Check existing group
    const existingGroup = await this.groupRepository.findOne({
      where: { groupNumber: createGroupDto.groupNumber },
    })

    if (existingGroup) {
      throw new BadRequestException(
        [`groupNumber::Group with number ${createGroupDto.groupNumber} already exists`]
      )
    }

    // Create group
    const group = this.groupRepository.create({
      groupNumber: createGroupDto.groupNumber,
      ageRange: createGroupDto.ageRange,
      maxStudents: createGroupDto.maxStudents,
      courseId: createGroupDto.courseId,
      currentStudents: 0,
    })

    // Save group to get ID
    const savedGroup = await this.groupRepository.save(group)

    // Add schedule if provided
    if (createGroupDto.schedule && createGroupDto.schedule.length > 0) {
      const scheduleEntities = createGroupDto.schedule.map((scheduleDto) => {
        return this.groupScheduleRepository.create({
          dayOfWeek: scheduleDto.dayOfWeek,
          startTime: scheduleDto.startTime,
          endTime: scheduleDto.endTime,
          groupId: savedGroup.id,
          group: savedGroup,
        })
      })

      await this.groupScheduleRepository.save(scheduleEntities)
      savedGroup.schedule = scheduleEntities
    }

    return savedGroup
  }

  async getUniqueAgeRanges(): Promise<string[]> {
    const groups = await this.groupRepository.find({
      select: ['ageRange'],
    });
  
    const normalized = groups
      .map((g) => g.ageRange?.trim().replace(/\s+/g, '').toLowerCase())
      .filter(Boolean);
  
    const unique = Array.from(new Set(normalized));
  
    return unique;
  }
  

  async findAll(courseId?: number): Promise<Group[]> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.course", "course")
      .leftJoinAndSelect("group.schedule", "schedule")

    if (courseId) {
      queryBuilder.where("group.courseId = :courseId", { courseId })
    }

    return queryBuilder.orderBy("group.createdAt", "DESC").getMany()
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ["course", "schedule", "students", "students.student"],
    })

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    return group
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id)

    if (updateGroupDto.groupNumber && updateGroupDto.groupNumber !== group.groupNumber) {
      const existing = await this.groupRepository.findOne({ where: { groupNumber: updateGroupDto.groupNumber } });
      if (existing && existing.id !== id) {
        throw new BadRequestException([`groupNumber::Групп с номером «${updateGroupDto.groupNumber}» уже существует`]);
      }
    }

    // Update basic group info
    if (updateGroupDto.groupNumber) group.groupNumber = updateGroupDto.groupNumber
    if (updateGroupDto.ageRange !== undefined) group.ageRange = updateGroupDto.ageRange
    if (updateGroupDto.maxStudents) {
      if (updateGroupDto.maxStudents < group.currentStudents) {
        throw new BadRequestException(
          `Cannot set max students lower than current students count (${group.currentStudents})`,
        )
      }
      group.maxStudents = updateGroupDto.maxStudents
    }

    // Update course if provided
    if (updateGroupDto.courseId && updateGroupDto.courseId !== group.courseId) {
      const course = await this.courseRepository.findOne({
        where: { id: updateGroupDto.courseId },
      })

      if (!course) {
        throw new NotFoundException(`Course with ID ${updateGroupDto.courseId} not found`)
      }

      group.courseId = updateGroupDto.courseId
      group.course = course
    }

    // Update schedule if provided
    if (updateGroupDto.schedule) {
      // Remove existing schedule
      await this.groupScheduleRepository.delete({ groupId: id })

      // Add new schedule
      if (updateGroupDto.schedule.length > 0) {
        const scheduleEntities = updateGroupDto.schedule.map((scheduleDto) => {
          return this.groupScheduleRepository.create({
            dayOfWeek: scheduleDto.dayOfWeek,
            startTime: scheduleDto.startTime,
            endTime: scheduleDto.endTime,
            groupId: group.id,
            group: group,
          })
        })

        await this.groupScheduleRepository.save(scheduleEntities)
        group.schedule = scheduleEntities
      } else {
        group.schedule = []
      }
    }

    return await this.groupRepository.save(group)
  }

  async remove(id: number): Promise<void> {
    const group = await this.findOne(id)
    await this.groupRepository.remove(group)
  }

  async addStudent(groupId: number, studentId: number): Promise<Group> {
    // Get group
    const group = await this.findOne(groupId)

    // Check if group is full
    if (group.currentStudents >= group.maxStudents) {
      throw new BadRequestException(`Group is full (${group.currentStudents}/${group.maxStudents})`)
    }

    // Check if student exists and is a student
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    })

    if (!student) {
      throw new NotFoundException(`User with ID ${studentId} not found`)
    }

    if (student.role !== UserRole.STUDENT) {
      throw new BadRequestException(`User with ID ${studentId} is not a student`)
    }

    // Check if student is already in the group
    const existingRelation = await this.groupStudentRepository.findOne({
      where: { groupId, studentId },
    })

    if (existingRelation) {
      throw new BadRequestException(`Student with ID ${studentId} is already in group with ID ${groupId}`)
    }

    // Create relation
    const groupStudent = this.groupStudentRepository.create({
      groupId,
      studentId,
      group,
      student,
    })

    await this.groupStudentRepository.save(groupStudent)

    // Update current students count
    group.currentStudents += 1
    await this.groupRepository.save(group)

    return this.findOne(groupId)
  }

  async removeStudent(groupId: number, studentId: number): Promise<Group> {
    // Get group
    const group = await this.findOne(groupId)

    // Check if student is in the group
    const relation = await this.groupStudentRepository.findOne({
      where: { groupId, studentId },
    })

    if (!relation) {
      throw new NotFoundException(`Student with ID ${studentId} is not in group with ID ${groupId}`)
    }

    // Remove relation
    await this.groupStudentRepository.delete({ groupId, studentId })

    // Update current students count
    group.currentStudents -= 1
    await this.groupRepository.save(group)

    return this.findOne(groupId)
  }

  async getStudents(groupId: number): Promise<User[]> {
    // Check if group exists
    await this.findOne(groupId)

    // Get students
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .innerJoin("group_students", "gs", "gs.studentId = user.id")
      .where("gs.groupId = :groupId", { groupId })

    return queryBuilder.getMany()
  }
}

