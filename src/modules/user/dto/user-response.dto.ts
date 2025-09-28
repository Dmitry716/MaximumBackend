import { ApiProperty } from "@nestjs/swagger"
import { Exclude, Expose } from "class-transformer"
import { UserRole } from "../enums/user-role.enum"
import { UserStatus } from "../enums/user-status.enum"

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ description: "User ID" })
  id: number

  @Expose()
  @ApiProperty({ description: "User name" })
  name: string

  @Expose()
  @ApiProperty({ description: "User email" })
  email: string

  @Expose()
  @ApiProperty({ description: "User phone", required: false })
  phone?: string

  @Expose()
  @ApiProperty({ description: "User role", enum: UserRole })
  role: UserRole

  @Expose()
  @ApiProperty({ description: "User avatar URL", required: false })
  avatar?: string

  @Expose()
  @ApiProperty({ description: "User status", enum: UserStatus })
  status: UserStatus

  @Expose()
  @ApiProperty({ description: "User registration date" })
  registrationDate: Date

  @Expose()
  @ApiProperty({ description: "User biography", required: false })
  biography?: string

  @Expose()
  @ApiProperty({ description: "User birth date", required: false })
  birthDate?: Date

  @Expose()
  @ApiProperty({ description: "User location", required: false })
  location?: string

  @Expose()
  @ApiProperty({ description: "User occupation", required: false })
  occupation?: string

  @Expose()
  @ApiProperty({ description: "User education", required: false })
  education?: string

  @Expose()
  @ApiProperty({ description: "User website", required: false })
  website?: string

  @Expose()
  @ApiProperty({ description: "User interests", type: [String], required: false })
  interests?: string[]

  @Expose()
  @ApiProperty({ description: "User social links", type: [Object], required: false })
  socialLinks?: { platform: string; url: string }[]

  @Expose()
  @ApiProperty({ description: "User skills", type: [String], required: false })
  skills?: string[]

  @Expose()
  @ApiProperty({ description: "User languages", type: [String], required: false })
  languages?: string[]

  @Expose()
  @ApiProperty({ description: "User notification settings", type: Object, required: false })
  notificationSettings?: {
    email: boolean
    sms: boolean
    push: boolean
  }

  @Expose()
  @ApiProperty({ description: "User creation date" })
  createdAt: Date

  @Expose()
  @ApiProperty({ description: "User last update date" })
  updatedAt: Date
}

