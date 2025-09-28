import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ImageDto {
  @IsString()
  @ApiPropertyOptional({ description: "Image URL" })
  url: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Video URL" })
  videoUrl?: string;
}
