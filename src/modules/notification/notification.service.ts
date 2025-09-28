import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import { Queue } from "bull"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./entities/notification.entity";
import { NotificationType } from "./enums/notification-type.enum";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notiRepository: Repository<Notification>,
    @InjectQueue('notifications') private notificationsQueue: Queue
  ) { }

  async create(input: {
    userId: number;
    title: string;
    message: string;
    type: NotificationType;
    entityId?: number;
    entityType?: string;
  }) {
    this.logger.log(`Creating notification for user ${input.userId}`);
    const notification = this.notiRepository.create({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      entityId: input.entityId,
      entityType: input.entityType,
    });

    return await this.notiRepository.save(notification);
  }

  async getUnread(userId: number) {
    return this.notiRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getAll(userId: number) {
    const [unread, read] = await Promise.all([
      this.notiRepository.find({
        where: { userId, isRead: false },
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user'],
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      }),
      this.notiRepository.find({
        where: { userId, isRead: true },
        order: { createdAt: 'DESC' },
        relations: ['user'],
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      }),
    ]);
  
    return [...unread, ...read];
  }
  

  async getAllAdmin() {    
    const [unread, read] = await Promise.all([
      this.notiRepository.find({
        where: { isReadAdmin: true },
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user'], 
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          isReadAdmin: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }),
      this.notiRepository.find({
        where: { isReadAdmin: false },
        order: { createdAt: 'DESC' },
        relations: ['user'],
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          isReadAdmin: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }),
    ]);
  
    return [...read, ...unread];
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.notiRepository.findOneBy({ id, userId });
    if (!notification) throw new NotFoundException('Notification not found');

    notification.isRead = true;
    return await this.notiRepository.save(notification);
  }

  async markManyAsRead(ids: number[], userId: number) {
    if (!ids.length) return { updated: 0 }
    
    const result = await this.notiRepository
      .createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where("id IN (:...ids)", { ids })
      .andWhere("userId = :userId", { userId })
      .execute();

    return { updated: result.affected || 0 };
  }

  async markManyAsReadAdmin(ids: number[]) {
    if (!ids.length) return { updated: 0 }

    const result = await this.notiRepository
      .createQueryBuilder()
      .update()
      .set({ isReadAdmin: true })
      .where("id IN (:...ids)", { ids })
      .execute();

    return { updated: result.affected || 0 };
  }

  async sendWelcomeEmail(userId: number, email: string) {

    try {
      const job = await this.notificationsQueue.add("welcome-email", {
        userId,
        email,
      });

      this.logger.log(`Welcome email queued for user ${userId} (${email})`);
    } catch (error) {
      this.logger.error(`Failed to queue welcome email: ${error.message}`, error.stack)
      // Не выбрасываем ошибку, чтобы не прерывать основной процесс
    }
  }

  async sendCourseEnrollmentConfirmation(userId: number, email: string, courseId: number) {
    try {
      await this.notificationsQueue.add("course-enrollment", {
        userId,
        email,
        courseId,
      })
      this.logger.log(`Course enrollment confirmation queued for user ${userId} (${email}) for course ${courseId}`)
    } catch (error) {
      this.logger.error(`Failed to queue course enrollment confirmation: ${error.message}`, error.stack)
      // Не выбрасываем ошибку, чтобы не прерывать основной процесс
    }
  }
}

