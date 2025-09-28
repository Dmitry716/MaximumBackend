import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Enrollment } from "./entities/enrollment.entity"
import type { CreateEnrollmentDto } from "./dto/create-enrollment.dto"
import type { UpdateEnrollmentDto } from "./dto/update-enrollment.dto"

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.create(createEnrollmentDto)
    return await this.enrollmentRepository.save(enrollment)
  }

  async findAll(page = 1, limit = 10): Promise<{ items: Enrollment[]; total: number }> {
    const [items, total] = await this.enrollmentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ["user", "course"],
    })

    return { items, total }
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ["user", "course"],
    })
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`)
    }
    return enrollment
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.findOne(id)
    Object.assign(enrollment, updateEnrollmentDto)
    return await this.enrollmentRepository.save(enrollment)
  }

  async remove(id: number): Promise<void> {
    const result = await this.enrollmentRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`)
    }
  }
}

