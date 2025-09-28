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
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'Full name of the user', example: 'John Doe' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: 'Email address of the user', example: 'john.doe@example.com' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiPropertyOptional({ description: 'Password', example: 'securePass123' })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiPropertyOptional({ description: 'Password', example: 'securePass123' })
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Phone number', example: '+998901234567' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ description: 'User role', enum: UserRole, example: UserRole.STUDENT })
  role?: UserRole;

  @IsOptional()
  @ApiPropertyOptional({ description: 'User avatar URL', example: 'https://example.com/avatar.png' })
  avatar?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({ description: 'User status', enum: UserStatus, example: UserStatus.ACTIVE })
  status?: UserStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User biography', example: 'I am a passionate developer.' })
  biography?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'Birth date', type: String, format: 'date', example: '1995-05-23' })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User location', example: 'Tashkent, Uzbekistan' })
  location?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User occupation', example: 'Software Engineer' })
  occupation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User education', example: 'TUIT Bachelor in CS' })
  education?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'User website URL', example: 'https://johndoe.dev' })
  website?: string;
}
