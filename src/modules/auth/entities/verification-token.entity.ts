import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'verification_tokens' })
export class VerificationTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  @Exclude()
  token!: string;

  @Column({ length: 255 })
  identifier!: string;

  @Column({ default: false, name: 'is_expired' })
  isExpired: boolean;

  @Column()
  expires!: Date;
}
