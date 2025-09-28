import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FileType } from "../enums/file-type.enum";

export class UploadFileDto {
  @IsEnum(FileType, {
    message: `fileType must be one of: ${Object.values(FileType).join(', ')}`,
  })
  @ApiProperty({
    description: "File type",
    enum: FileType,
    enumName: "FileType",
    example: FileType.COURSE_MATERIAL,
  })
  fileType: FileType;

  @IsOptional()
  @IsNumber({}, { message: 'entityId must be a number' })
  @ApiProperty({
    description: "Related entity ID (course, lesson, etc.)",
    required: false,
    type: Number,
    example: 123,
  })
  entityId?: number;

  @IsOptional()
  @ApiProperty({
    description: "Related entity type (e.g., 'course', 'lesson')",
    required: false,
    type: String,
    example: "course",
  })
  entityType?: string;
}
