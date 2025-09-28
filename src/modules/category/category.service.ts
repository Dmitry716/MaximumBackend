import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Category } from "./entities/category.entity"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { UpdateCategoryDto } from "./dto/update-category.dto"

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto)

    const existingUser = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    })

    if (existingUser) {
      throw new ConflictException("Категория с таким названием уже существует")
    }
    return await this.categoryRepository.save(category)
  }

  async findAll(): Promise<Array<Category>> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.courses', 'course')
      .loadRelationCountAndMap('category.coursesCount', 'category.courses')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(enrollment.id)', 'studentCount')
          .from('categories', 'cat')
          .innerJoin('courses', 'course', 'course.categoryId = cat.id')
          .innerJoin('enrollments', 'enrollment', 'enrollment.courseId = course.id')
          .innerJoin('users', 'user', 'user.id = enrollment.userId')
          .where('cat.id = category.id')
          .andWhere('user.role = :role', { role: 'student' })
      }, 'studentCount')
      .orderBy('category.id', 'ASC')
      .getRawAndEntities()
      .then(({ entities, raw }) => {
        return entities.map((category, index) => ({
          ...category,
          studentCount: parseInt(raw[index].studentCount ?? '0'),
        }));
      });
  }

  async findPublic(): Promise<Array<Category>> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.courses', 'course')
      .where('category.status = :status', { status: 'active' })
      .loadRelationCountAndMap('category.coursesCount', 'category.courses')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(enrollment.id)', 'studentCount')
          .from('categories', 'cat')
          .innerJoin('courses', 'course', 'course.categoryId = cat.id')
          .innerJoin('enrollments', 'enrollment', 'enrollment.courseId = course.id')
          .innerJoin('users', 'user', 'user.id = enrollment.userId')
          .where('cat.id = category.id')
          .andWhere('user.role = :role', { role: 'student' })
          .andWhere('enrollment.status = :status', { status: 'active' })
      }, 'studentCount')
      .orderBy('category.id', 'ASC')
      .getRawAndEntities()
      .then(({ entities, raw }) => {
        return entities.map((category, index) => ({
          ...category,
          studentCount: parseInt(raw[index].studentCount ?? '0'),
        }));
      });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["courses"],
    })
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id)

    if (
      updateCategoryDto.name && 
      updateCategoryDto.name !== category.name
    ) {
      const existingUser = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
    
      if (existingUser) {
        throw new ConflictException("Категория с таким названием уже существует");
      }
    }    
    
    Object.assign(category, updateCategoryDto)
    return await this.categoryRepository.save(category)
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
  }
}

