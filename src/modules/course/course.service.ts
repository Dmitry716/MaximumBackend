import { Injectable, NotFoundException, Inject, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { Course } from "./entities/course.entity"
import { CreateCourseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { CourseStatus } from "./enums/course-status.enum"
import { generateCacheKey } from "src/common/filters/generate-cache-key"
import { GroupStudent } from "../group/entities/group-student.entity"
import { Image } from "./entities/images.entity"

interface FindAllFilters {
  categories?: number[];
  minPrice?: number;
  maxPrice?: number;
  level?: string;
  search?: string;
  limit?: number;
  page?: number;
}

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(GroupStudent)
    private readonly groupStudentRepository: Repository<GroupStudent>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { name } = createCourseDto;

    const existing = await this.courseRepository.findOne({ where: { name } });

    if (existing) {
      throw new BadRequestException(`Курс с названием «${name}» уже существует.`);
    }

    const savedCourse = this.courseRepository.create({
      ...createCourseDto,
      images: createCourseDto.images?.map(img => this.imageRepository.create(img)),
    });

    await this.courseRepository.save(savedCourse);

    if (createCourseDto.status === "published") {
      this.eventEmitter.emit(`course.created`, {
        entity: "course",
        data: savedCourse,
        eventName: 'course.created',
      });
    }

    await this.cacheManager.del("all_courses");
    return savedCourse;
  }

  async findAllPublic(filters: FindAllFilters): Promise<{ items: Course[]; total: number, page: number, limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const hasActiveFilters =
      (filters.categories && filters.categories.length > 0) ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.search !== undefined ||
      filters.level !== undefined;

    const cacheKey = generateCacheKey('courses', { ...filters, page, limit });

    if (!hasActiveFilters) {
      const cached = await this.cacheManager.get<{ items: Course[]; total: number; page: number; limit: number }>(cacheKey);
      if (cached) return cached;
    }

    const qb = this.buildBaseQuery();

    if (filters.categories && filters.categories.length > 0) {
      qb.andWhere('category.id IN (:...categories)', {
        categories: filters.categories,
      });
    }

    if (filters.search) {
      qb.andWhere('LOWER(course.name) LIKE LOWER(:search)', {
        search: `%${filters.search}%`,
      });
    }

    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined
    ) {
      qb.andWhere('course.price BETWEEN :min AND :max', {
        min: filters.minPrice,
        max: filters.maxPrice,
      });
    } else if (filters.minPrice !== undefined) {
      qb.andWhere('course.price >= :min', { min: filters.minPrice });
    } else if (filters.maxPrice !== undefined) {
      qb.andWhere('course.price <= :max', { max: filters.maxPrice });
    }

    if (filters.level) {
      qb.andWhere('group.ageRange = :ageRange', { ageRange: filters.level });
    }

    const total = await qb.getCount();
    qb.skip((page - 1) * limit).take(limit);
    const items = await qb.getMany();

    const result = { items, total, page, limit };

    if (!hasActiveFilters) {
      await this.cacheManager.set(cacheKey, result, 3600);
    }

    return result;
  }

  async findAll(): Promise<Course[]> {
    const cacheKey = "all_courses"
    const cached = await this.cacheManager.get<Course[]>(cacheKey)
    if (cached) return cached

    // 1. Kurslarni olamiz
    const courses = await this.courseRepository.find({
      relations: {
        category: true,
        instructor: true,
        groups: {
          schedule: true
        }
      },
      order: {
        createdAt: 'DESC'
      }
    });

    // 2. Barcha gruppa ID larini yig'amiz
    const allGroupIds = courses.flatMap(course => course.groups.map(group => group.id));

    // 3. Bitta query bilan barcha gruppalar uchun student count
    let groupStudentCounts = {};
    if (allGroupIds.length > 0) {
      const studentCounts = await this.groupStudentRepository
        .createQueryBuilder('gs')
        .select('gs.groupId', 'groupId')
        .addSelect('COUNT(gs.studentId)', 'studentCount')
        .where('gs.groupId IN (:...groupIds)', { groupIds: allGroupIds })
        .groupBy('gs.groupId')
        .getRawMany();

      groupStudentCounts = studentCounts.reduce((acc, item) => {
        acc[item.groupId] = parseInt(item.studentCount) || 0;
        return acc;
      }, {});
    }

    // 4. Natijani shakllantirish
    const coursesWithCount = courses.map(course => {
      const groupsWithCurrentStudents = course.groups.map(group => ({
        ...group,
        currentStudents: groupStudentCounts[group.id] || 0
      }));

      const studentCount = groupsWithCurrentStudents
        .reduce((sum, group) => sum + group.currentStudents, 0);

      return {
        ...course,
        groups: groupsWithCurrentStudents,
        studentCount
      };
    });

    await this.cacheManager.set(cacheKey, coursesWithCount, 3600);
    return coursesWithCount;
  }

  private buildBaseQuery() {
    return this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.images', 'images')
      .leftJoin('course.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.url'])
      .leftJoinAndSelect('course.groups', 'group')
      .leftJoin('course.instructor', 'instructor')
      .addSelect(['instructor.id', 'instructor.name', 'instructor.avatar'])
      .leftJoinAndSelect('group.schedule', 'schedule')
      .loadRelationCountAndMap(
        'group.currentStudents',
        'group.students',
      )
      .loadRelationCountAndMap(
        'course.studentCount',
        'course.enrollments',
      )
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('course.createdAt', 'DESC');
  }

  async findAllByInstructor(instructorId: number): Promise<Course[]> {
    const cacheKey = `courses_instructor_${instructorId}`;
    const cachedData = await this.cacheManager.get<Course[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoin('course.category', 'category')
      .addSelect('category.name')
      .leftJoinAndSelect('course.groups', 'group')
      .leftJoin('course.instructor', 'instructor')
      .addSelect('instructor.name')
      .leftJoinAndSelect('group.schedule', 'schedule')
      .loadRelationCountAndMap('group.currentStudents', 'group.students')
      .loadRelationCountAndMap('course.studentCount', 'course.enrollments')
      .where('course.instructorId = :instructorId', { instructorId })
      .orderBy('course.createdAt', 'DESC')
      .getMany();

    await this.cacheManager.set(cacheKey, courses, 3600);
    return courses;
  }

  async findOne(id: number): Promise<Course> {
    const cacheKey = `course_${id}`
    const cachedCourse = await this.cacheManager.get<Course>(cacheKey)

    if (cachedCourse) {
      return cachedCourse
    }

    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ["category", "instructor", "lessons"],
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }

    await this.cacheManager.set(cacheKey, course, 3600)

    return course
  }

  async findOneByName(name: string): Promise<Course> {
    const cacheKey = `course__${name}`
    const cachedCourse = await this.cacheManager.get<Course>(cacheKey)

    if (cachedCourse) {
      return cachedCourse
    }

    const course = await this.courseRepository.findOne({
      where: { url: name },
      relations: ["category", "instructor", "lessons", "groups", "groups.schedule"],
    })

    if (!course) {
      throw new NotFoundException(`Course with name ${name} not found`)
    }

    const groupIds = course.groups.map(g => g.id)

    const studentCount = await this.groupStudentRepository.count({
      where: {
        groupId: In(groupIds),
      },
    })

    const courseWithCount = { ...course, studentCount }

    await this.cacheManager.set(cacheKey, courseWithCount, 3600)

    return courseWithCount
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    if (updateCourseDto.categoryId !== undefined) {
      course.category = { id: updateCourseDto.categoryId } as any;
    }

    if (updateCourseDto.instructorId !== undefined) {
      course.instructor = { id: updateCourseDto.instructorId } as any;
    }

    if (course.status !== CourseStatus.PUBLISHED && updateCourseDto.status === CourseStatus.PUBLISHED) {
      this.eventEmitter.emit(`course.created`, {
        entity: "course",
        data: updateCourseDto,
        eventName: 'course.created',
      });
    }

    if (updateCourseDto.name && updateCourseDto.name !== course.name) {
      const existing = await this.courseRepository.findOne({ where: { name: updateCourseDto.name } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Курс с названием «${updateCourseDto.name}» уже существует`);
      }
    }

    if (updateCourseDto.images) {

      await this.imageRepository.delete({ course: { id } });

      const newImages = updateCourseDto.images.map(img => this.imageRepository.create({ ...img, course }));
      course.images = newImages;
    }

    Object.assign(course, updateCourseDto);

    const updatedCourse = await this.courseRepository.save(course);


    await this.cacheManager.del(`course_${id}`);
    await this.cacheManager.del("all_courses");


    return updatedCourse;
  }

  async remove(id: number): Promise<void> {
    const result = await this.courseRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }
    await this.cacheManager.del(`course_${id}`)
    await this.cacheManager.del("all_courses")
  }

  async findGroups(courseId: number): Promise<any[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ["groups", "groups.schedule"],
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    return course.groups || []
  }
}

