import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  firstName: string;

  @Column({ length: 255, nullable: true })
  lastName: string;

  @Column({ length: 255, nullable: true })
  @Exclude()
  password: string;

  @Column({ default: 'inactive', nullable: true })
  status: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'date' })
  deletedAt: Date;
}

export default UserEntity;
