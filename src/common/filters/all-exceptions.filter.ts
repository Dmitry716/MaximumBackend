import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common"
import type { Request, Response } from "express"
import { QueryFailedError } from "typeorm"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Internal server error"
    let error = "Internal Server Error"

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const errorResponse = exception.getResponse() as any
      message = errorResponse.message || exception.message
      error = errorResponse.error || "Error"
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST
      message = exception.message
      error = "Database Error"
    } else if (exception instanceof Error) {
      message = exception.message
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    )

    // Send the response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    })
  }
}

