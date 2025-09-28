import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Lesson } from "./entities/lesson.entity"
import type { CreateLessonDto } from "./dto/create-lesson.dto"
import type { UpdateLessonDto } from "./dto/update-lesson.dto"

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const lesson = this.lessonRepository.create(createLessonDto)
    return await this.lessonRepository.save(lesson)
  }

  async findAll(courseId: number): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { courseId },
      order: { order: "ASC" },
    })
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ["course"],
    })
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`)
    }
    return lesson
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id)
    Object.assign(lesson, updateLessonDto)
    return await this.lessonRepository.save(lesson)
  }

  async remove(id: number): Promise<void> {
    const result = await this.lessonRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Lesson with ID ${id} not found`)
    }
  }
}

