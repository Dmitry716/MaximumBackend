import { NotificationType } from './enums/notification-type.enum';

export const EventToNotificationMap: Record<string, NotificationType> = {
  'course.created': NotificationType.NEW_COURSE,
  'course.updated': NotificationType.SYSTEM_ANNOUNCEMENT,
  'user.updated': NotificationType.NEW_TECHER,
  'course.deleted': NotificationType.SYSTEM_ANNOUNCEMENT,
  'application.status': NotificationType.APPLICATION_STATUS,

  'course.enrolled': NotificationType.COURSE_ENROLLMENT,
  'course.completed': NotificationType.COURSE_COMPLETION,

  'lesson.created': NotificationType.NEW_LESSON,

  'application.updated': NotificationType.APPLICATION_STATUS,

};
