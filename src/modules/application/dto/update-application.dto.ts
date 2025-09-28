import { PartialType } from "@nestjs/swagger"
import { CreateApplicationDto } from "./create-application.dto"
import { IsString, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Admin response message", required: false })
  responseMessage?: string
}

