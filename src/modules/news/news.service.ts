import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { News } from "./entities/news.entity"
import { CreateNewsDto } from "./dto/create-news.dto"
import { UpdateNewsDto } from "./dto/update-news.dto"
import { User } from "../user/entities/user.entity"

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const { authorId,title, ...newsData } = createNewsDto

    const existing = await this.newsRepository.findOne({ where: { title } });

    if (existing) {
      throw new BadRequestException(`Новость с названием «${title}» уже существует.`);
    }
    // Create news
    const news = this.newsRepository.create(newsData)

    // Set author if provided
    if (authorId) {
      const author = await this.userRepository.findOne({ where: { id: authorId } })
      if (author) {
        news.author = author
        news.authorId = author.id
      }
    }

    return this.newsRepository.save(news)
  }

  async findAll
    (page = 1,
      limit = 10,
      status?: string,
      categoryName?: string,
      excludeNewsId?: number
    ): Promise<{ items: News[]; total: number }> {
    const queryBuilder = this.newsRepository
    .createQueryBuilder("news")
    .leftJoinAndSelect("news.author", "author")

    if (status) {
      queryBuilder.where("news.status = :status", { status })
    }

    if (categoryName) {
      if (status) {
        queryBuilder.andWhere("news.category = :categoryName", { categoryName });
      } else {
        queryBuilder.where("news.category = :categoryName", { categoryName });
      }
    }

    if (excludeNewsId) {
      if (status || categoryName) {
        queryBuilder.andWhere("news.id != :excludeNewsId", { excludeNewsId });
      } else {
        queryBuilder.where("news.id != :excludeNewsId", { excludeNewsId });
      }
    }

    if (categoryName && excludeNewsId) {
      const [items, total] = await queryBuilder
        .orderBy("news.date", "DESC")
        .take(3)
        .getManyAndCount();

      return { items, total };
    }

    const [items, total] = await queryBuilder
      .orderBy("news.date", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { items, total }
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ["author"],
    })

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`)
    }

    return news
  }
  async findOneByUrl(url: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { url },
      relations: ["author"],
    })

    if (!news) {
      throw new NotFoundException(`News with URL ${url} not found`)
    }

    return news
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id)

    if (updateNewsDto.title && updateNewsDto.title !== news.title) {
      const existing = await this.newsRepository.findOne({ where: { title: updateNewsDto.title } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Новость с названием «${updateNewsDto.title}» уже существует`);
      }
    }
    // Update news data
    Object.assign(news, updateNewsDto)

    // Update author if provided
    if (updateNewsDto.authorId) {
      const author = await this.userRepository.findOne({
        where: { id: updateNewsDto.authorId },
      })
      if (author) {
        news.author = author
        news.authorId = author.id
      }
    }

    return this.newsRepository.save(news)
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id)
    await this.newsRepository.remove(news)
  }
}

