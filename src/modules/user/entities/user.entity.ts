import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Exclude } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../enums/user-role.enum"
import { UserStatus } from "../enums/user-status.enum"
import { Enrollment } from "../../enrollment/entities/enrollment.entity"
import { Application } from "../../application/entities/application.entity"
import { Course } from "../../course/entities/course.entity"
import { UserInterest } from "./user-interest.entity"
import { UserSocialLink } from "./user-social-link.entity"
import { UserSkill } from "./user-skill.entity"
import { UserLanguage } from "./user-language.entity"
import { UserNotification } from "./user-notification.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "User unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "User name" })
  name: string

  @Column({ unique: true })
  @ApiProperty({ description: "User email address" })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({ nullable: true })
  @ApiProperty({ description: "User phone number", required: false })
  phone?: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  @ApiProperty({
    description: "User role",
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  role: UserRole

  @Column({ nullable: true })
  @ApiProperty({ description: "User avatar URL", required: false })
  avatar?: string

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @ApiProperty({
    description: "User status",
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "User registration date" })
  registrationDate: Date

  @Column({ type: "text", nullable: true })
  @ApiProperty({ description: "User biography", required: false })
  biography?: string

  @Column({ type: "date", nullable: true })
  @ApiProperty({ description: "User birth date", required: false })
  birthDate?: Date

  @Column({ nullable: true })
  @ApiProperty({ description: "User location", required: false })
  location?: string

  @Column({ nullable: true })
  @ApiProperty({ description: "User occupation", required: false })
  occupation?: string

  @Column({ nullable: true })
  @ApiProperty({ description: "User education", required: false })
  education?: string

  @Column({ nullable: true })
  @ApiProperty({ description: "User website", required: false })
  website?: string

  @Column({ nullable: true })
  @ApiProperty({ description: "Reset password token", required: false })
  resetPasswordToken?: string

  @Column({ type: "datetime", nullable: true })
  @ApiProperty({ description: "Reset password token expiration", required: false })
  resetPasswordExpires?: Date

  @CreateDateColumn()
  @ApiProperty({ description: "User creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "User last update timestamp" })
  updatedAt: Date

  @OneToMany(
    () => Enrollment,
    (enrollment) => enrollment.user,
    { onDelete: "CASCADE" },
  )
  enrollments: Enrollment[]

  @OneToMany(
    () => Application,
    (application) => application.user,
    { onDelete: "SET NULL" },
  )
  applications: Application[]

  @OneToMany(
    () => Course,
    (course) => course.instructor,
    { onDelete: "SET NULL" },
  )
  coursesTeaching: Course[]

  @OneToMany(
    () => UserInterest,
    (interest) => interest.user,
    { onDelete: "CASCADE" },
  )
  interests: UserInterest[]

  @OneToMany(
    () => UserSocialLink,
    (socialLink) => socialLink.user,
    { onDelete: "CASCADE" },
  )
  socialLinks: UserSocialLink[]

  @OneToMany(
    () => UserSkill,
    (skill) => skill.user,
    { onDelete: "CASCADE" },
  )
  skills: UserSkill[]

  @OneToMany(
    () => UserLanguage,
    (language) => language.user,
    { onDelete: "CASCADE" },
  )
  languages: UserLanguage[]

  @OneToMany(
    () => UserNotification,
    (notification) => notification.user,
    { onDelete: "CASCADE" },
  )
  notificationSettings: UserNotification[]

  // Helper method to check if user has a specific role
  hasRole(role: UserRole): boolean {
    return this.role === role
  }
}

