import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException } from "@nestjs/common"

interface ParseDatePipeOptions {
  optional?: boolean
}

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | undefined> {
  private readonly options: ParseDatePipeOptions

  constructor(options: ParseDatePipeOptions = {}) {
    this.options = options
  }

  transform(value: string, metadata: ArgumentMetadata): Date | undefined {
    if (value === undefined || value === null || value === "") {
      if (this.options.optional) {
        return undefined
      }
      throw new BadRequestException("Date value is required")
    }

    const date = new Date(value)

    if (isNaN(date.getTime())) {
      throw new BadRequestException("Invalid date format")
    }

    return date
  }
}

