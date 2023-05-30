import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column()
  type!: string;

  @Column({ length: 255 })
  provider!: string;

  @Column({ name: 'provider_account_id', length: 255 })
  providerAccountId!: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;
}
