// src/notification/listeners/generic.listener.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../notification.service';
import { EventToNotificationMap } from '../notification.mapping';

@Injectable()
export class GenericNotificationListener {
  private readonly logger = new Logger(GenericNotificationListener.name);

  constructor(private readonly notificationService: NotificationService) { }

  @OnEvent('*.*', { async: true })
  async handleAllEvents(payload: any) {
    console.log(payload, 'GenericNotificationListener');
    if (!payload.eventName) {
      this.logger.warn(`Unhandled event received: ${payload}`);
      return;
    }

    try {
      const { data, entity, eventName } = payload;
      const title = this.makeTitle(eventName, data);
      const message = this.makeMessage(eventName, data, entity);

      if (eventName === 'course.created') {
        await this.notificationService.create({
          userId: data?.userId || data?.authorId || data?.instructorId || null,
          title,
          message,
          type: EventToNotificationMap[eventName],
          entityId: data?.id || null,
          entityType: entity,
        });
      } else if (eventName === "user.updated") {
        await this.notificationService.create({
          userId: data?.id,
          title,
          message,
          type: EventToNotificationMap[eventName],
          entityId: data?.id || null,
          entityType: entity,
        });
      } else if (eventName === "application.status") {
        await this.notificationService.create({
          userId: data?.adminId,
          title,
          message,
          type: EventToNotificationMap[eventName],
          entityId: data?.id || null,
          entityType: entity,
        });
      }

      this.logger.log(`Notification created for event ${eventName}`);
    } catch (error) {
      this.logger.error(`Failed to create notification for event:`, error);
    }
  }

  private makeTitle(event: string, data: any): string {
    switch (event) {
      case 'course.created':
        return `Created a new course: ${data.name}`;
      case 'user.updated':
        return `New teacher: ${data.name}`;
      case 'application.status':
        return `Статус заявки: Завершена`;
      case 'course.enrolled':
        return 'Siz kursga yozildingiz';
      case 'lesson.created':
        return `"${data.title}" dars yangi qo‘shildi`;
      default:
        return `Voqea: ${event}`;
    }
  }

  private makeMessage(event: string, data: any, entity: string): string {
    switch (event) {
      case 'course.created':
        return `${data.description}`;
      case 'course.enrolled':
        return `Siz muvaffaqiyatli ${data.courseTitle} kursiga yozildingiz.`;
      case 'application.status':
        return `${data.childName}: Зачислен на курс`;
      default:
        return `${entity} ${event}`;
    }
  }
}
