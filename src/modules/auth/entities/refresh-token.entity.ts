import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "../../user/entities/user.entity"

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  token: string

  @Column()
  expiresAt: Date

  @Column({ default: false })
  revoked: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User
}

