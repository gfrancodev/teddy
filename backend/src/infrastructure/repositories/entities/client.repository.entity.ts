import { ClientEntity } from '@/domain/entities/client.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { UserRepositoryEntity } from './user.repository.entity';
import { Status } from '@/domain/enum/status.enum';

@Entity('client')
export class ClientRepositoryEntity implements ClientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  @Index()
  user_id: string;

  @ManyToOne(() => UserRepositoryEntity, (user) => user.clients)
  @JoinColumn({ name: 'user_id' })
  user: UserRepositoryEntity;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  company_value: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  @Index()
  status: Status;

  @Column({
    type: 'bigint',
    default: () => 'current_timestamp_ms()',
  })
  created_at: number;

  @Column({
    type: 'bigint',
    default: () => 'current_timestamp_ms()',
  })
  updated_at: number;

  @Column({ type: 'bigint', nullable: true })
  deleted_at: number | null;
}
