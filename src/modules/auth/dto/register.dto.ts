import { IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe",
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: "User email",
    example: "admin@example.com",
  })
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  @ApiProperty({
    description: "User password (min 8 characters, must include uppercase, lowercase, and number)",
    example: "Password123",
  })
  password: string;
}
