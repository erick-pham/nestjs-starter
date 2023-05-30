import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum EVerificationTokenType {
  ResetPassword = 'reset-password',
  LoginEmail = 'login-email'
}

@Entity({ name: 'verification_tokens' })
export class VerificationTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  @Exclude()
  token!: string;

  @Column({ length: 255 })
  type!: string;

  @Column({ length: 255 })
  identifier!: string;

  @Column({ default: false, name: 'is_expired' })
  isExpired: boolean;

  @Column()
  expires!: Date;
}
