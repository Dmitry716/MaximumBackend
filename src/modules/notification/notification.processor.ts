import { Process, Processor } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import type { Job } from "bull"

@Processor("notifications")
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name)

  @Process("welcome-email")
  async handleWelcomeEmail(job: Job) {
    this.logger.debug("Sending welcome email")
    // Implement email sending logic here
    this.logger.debug(`Welcome email sent to ${job.data.email}`)
  }

  @Process("course-enrollment")
  async handleCourseEnrollment(job: Job) {
    this.logger.debug("Sending course enrollment confirmation")
    // Implement email sending logic here
    this.logger.debug(`Course enrollment confirmation sent to ${job.data.email} for course ${job.data.courseId}`)
  }
}

