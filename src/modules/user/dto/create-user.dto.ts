import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDate,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'Password', example: 'securePass123' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Phone number', required: false, example: '+998901234567' })
  phone?: string;

  @IsEnum(UserRole)
  @ApiProperty({ description: 'User role', enum: UserRole, example: UserRole.STUDENT })
  role: UserRole;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'User avatar URL', required: false, example: 'https://example.com/avatar.png' })
  avatar?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({ description: 'User status', enum: UserStatus, example: UserStatus.ACTIVE })
  status?: UserStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User biography', required: false, example: 'I am a passionate developer.' })
  biography?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'Birth date', type: String, format: 'date', required: false, example: '1995-05-23' })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User location', required: false, example: 'Tashkent, Uzbekistan' })
  location?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User occupation', required: false, example: 'Software Engineer' })
  occupation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User education', required: false, example: 'TUIT Bachelor in CS' })
  education?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'User website URL', required: false, example: 'https://johndoe.dev' })
  website?: string;
}
