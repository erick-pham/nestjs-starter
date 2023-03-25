import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'api_keys' })
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ unique: true, name: 'api_key', length: 255 })
  apiKey: string;

  @Column({ unique: true, name: 'api_secret', length: 255 })
  @Exclude()
  apiSecret: string;

  @Column({ name: 'api_name', length: 255 })
  apiName: string;

  @Column({ default: false, name: 'is_revoked' })
  isRevoked: boolean;

  @Column({
    type: 'simple-json',
    nullable: true
  })
  scopes?: object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ nullable: true, name: 'expired_at' })
  expiredAt?: Date;
}

export default ApiKeyEntity;
