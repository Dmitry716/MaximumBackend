import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"
import { BlogPost } from "./entities/blog-post.entity"
import { BlogPostTag } from "./entities/blog-post-tag.entity"
import { CreateBlogPostDto } from "./dto/create-blog-post.dto"
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto"
import { User } from "../user/entities/user.entity"
import { BlogPostStatus } from "./enums/blog-post-status.enum"

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(BlogPostTag)
    private blogPostTagRepository: Repository<BlogPostTag>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const { tags, title, authorId, ...postData } = createBlogPostDto

    const existing = await this.blogPostRepository.findOne({ where: { title } });

    if (existing) {
      throw new BadRequestException(`Пост с названием «${title}» уже существует.`);
    }
    // Create blog post
    const post = this.blogPostRepository.create(postData)

    // Set author if provided
    if (authorId) {
      const author = await this.userRepository.findOne({ where: { id: authorId } })
      if (author) {
        post.author = author
        post.authorId = author.id
      }
    }

    // Save post to get ID
    const savedPost = await this.blogPostRepository.save(post)

    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagEntities = tags.map((tag) => {
        return this.blogPostTagRepository.create({
          tag,
          post: savedPost,
          postId: savedPost.id,
        })
      })

      await this.blogPostTagRepository.save(tagEntities)
      savedPost.tags = tagEntities
    }

    return savedPost
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: string,
    categoryName?: string,
    excludeBlogId?: number
  ): Promise<{ items: BlogPost[]; total: number }> {
    const queryBuilder = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.tags", "tags")
      .leftJoinAndSelect("post.author", "author");

    if (status) {
      queryBuilder.where("post.status = :status", { status });
    }

    if (categoryName) {
      if (status) {
        queryBuilder.andWhere("post.category = :categoryName", { categoryName });
      } else {
        queryBuilder.where("post.category = :categoryName", { categoryName });
      }
    }

    if (excludeBlogId) {
      if (status || categoryName) {
        queryBuilder.andWhere("post.id != :excludeBlogId", { excludeBlogId });
      } else {
        queryBuilder.where("post.id != :excludeBlogId", { excludeBlogId });
      }
    }

    if (categoryName && excludeBlogId) {
      const [items, total] = await queryBuilder
        .orderBy("post.date", "DESC")
        .take(3)
        .getManyAndCount();

      return { items, total };
    }

    const [items, total] = await queryBuilder
      .orderBy("post.date", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }



  async findAllByTeacher(authorId: number, page = 1, limit = 10, status?: string): Promise<{ items: BlogPost[]; total: number }> {
    const queryBuilder = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.tags", "tags")
      .leftJoinAndSelect("post.author", "author")
      .where("post.authorId = :authorId", { authorId })

    if (status) {
      queryBuilder.andWhere("post.status = :status", { status })
    }

    const [items, total] = await queryBuilder
      .orderBy("post.date", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { items, total }
  }


  async findOne(id: number): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: ["tags", "author"],
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return post;
  }

  async findOneByUrl(url: string): Promise<BlogPost> {
    const news = await this.blogPostRepository.findOne({
      where: { url },
      relations: ["tags", "author"],
    })

    if (!news) {
      throw new NotFoundException(`Blog post with URL ${url} not found`)
    }

    return news
  }


  async update(id: number, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const { tags, ...updateData } = updateBlogPostDto

    // Get existing post
    const post = await this.findOne(id)
    
    if (updateBlogPostDto.title && updateBlogPostDto.title !== post.title) {
      const existing = await this.blogPostRepository.findOne({ where: { title: updateBlogPostDto.title } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Пост с названием «${updateBlogPostDto.title}» уже существует`);
      }
    }
    // Update post data
    Object.assign(post, updateData)

    // Update author if provided
    if (updateBlogPostDto.authorId) {
      const author = await this.userRepository.findOne({
        where: { id: updateBlogPostDto.authorId },
      })
      if (author) {
        post.author = author
        post.authorId = author.id
      }
    }

    // Save updated post
    await this.blogPostRepository.save(post)

    // Update tags if provided
    if (tags) {
      // Remove existing tags
      await this.blogPostTagRepository.delete({ postId: id })

      // Add new tags
      if (tags.length > 0) {
        const tagEntities = tags.map((tag) => {
          return this.blogPostTagRepository.create({
            tag,
            post,
            postId: id,
          })
        })

        await this.blogPostTagRepository.save(tagEntities)
        post.tags = tagEntities
      }
    }

    return post
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id)

    // Delete post (cascade will delete tags)
    await this.blogPostRepository.remove(post)
  }

    async findSeoByPageName(pageName: string): Promise<BlogPost | null> {
    // Ищем запись, где url = pageName (например, 'blog', 'courses', 'news')
    // Важно: не выбрасываем NotFoundException, если не найдено
    const queryBuilder = this.blogPostRepository.createQueryBuilder('post');
    queryBuilder.where('post.url = :url', { url: pageName });
    // Ограничиваем поиск только SEO-записями, если есть способ их отличить
    // queryBuilder.andWhere('post.isSeoPage = :isSeoPage', { isSeoPage: true }); // Опционально, если добавите флаг
    const post = await queryBuilder.getOne();
    return post || null; // Всегда возвращаем null, если не найдено
  }

  // Новый метод для обновления или создания SEO-данных
  async upsertSeoData(pageName: string, seoData: Partial<UpdateBlogPostDto>): Promise<BlogPost> {
    let existingSeoPost = await this.findSeoByPageName(pageName);

    if (existingSeoPost) {
      // Обновляем существующую SEO-запись
      // Убираем поля, которые не должны меняться для "SEO-страницы"
      const { title, content, status, category, authorId, images, tags, ...updateFields } = seoData;

      const updateDto: UpdateBlogPostDto = {
        ...updateFields, // metaTitle, metaDescription, keywords и другие разрешенные поля
        url: pageName, // Убедимся, что url установлен правильно
      };
      
      const updatedPost = await this.update(existingSeoPost.id, updateDto);
      return updatedPost
    } else {
      // Создаем новую SEO-запись
      // Устанавливаем специальные значения для "SEO-страницы"
      const newSeoPostData: CreateBlogPostDto = {
        url: pageName, // URL = pageName
        title: seoData.metaTitle || `SEO for ${pageName}`, // Дефолтный заголовок
        content: seoData.metaDescription || `Default content for ${pageName}`, // Дефолтное описание
        status: BlogPostStatus.PUBLISHED, // Или 'SEO_SETTINGS' если добавите enum
        category: 'SEO', // Или 'System' - категория для SEO-страниц
        authorId: 1, // Или ID администратора по умолчанию
        images: [], // Пустой массив
        tags: [], // Пустой массив
        // Добавляем остальные поля из seoData
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        keywords: seoData.keywords,
        // ... другие возможные SEO поля
      };
      const createdPost = await this.create(newSeoPostData);
      return createdPost;
    }
  }
}

