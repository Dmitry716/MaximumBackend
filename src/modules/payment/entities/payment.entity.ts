import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"
import { Course } from "../../course/entities/course.entity"
import { PaymentStatus } from "../enums/payment-status.enum"
import { PaymentMethod } from "../enums/payment-method.enum"

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "Payment unique identifier" })
  id: number

  @Column()
  @ApiProperty({ description: "Payment transaction ID" })
  transactionId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  @ApiProperty({ description: "User who made the payment" })
  user: User

  @Column()
  userId: number

  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  @JoinColumn({ name: "courseId" })
  @ApiProperty({ description: "Course the payment is for" })
  course: Course

  @Column()
  courseId: number

  @Column("decimal", { precision: 10, scale: 2 })
  @ApiProperty({ description: "Payment amount" })
  amount: number

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: "Discount amount" })
  discountAmount: number

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @ApiProperty({
    description: "Payment status",
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  status: PaymentStatus

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  @ApiProperty({
    description: "Payment method",
    enum: PaymentMethod,
  })
  method: PaymentMethod

  @Column("json", { nullable: true })
  @ApiProperty({ description: "Payment gateway response", required: false })
  gatewayResponse: Record<string, any>

  @CreateDateColumn()
  @ApiProperty({ description: "Payment creation timestamp" })
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: "Payment last update timestamp" })
  updatedAt: Date
}

