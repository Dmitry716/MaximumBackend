import { IsEmail, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: "User email",
    example: "admin@example.com",
  })
  email: string

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: "User password",
    example: "password123",
    minLength: 8,
  })
  password: string
}

