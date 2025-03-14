import { Entity, PrimaryColumn, Column, Index, OneToMany } from 'typeorm';
import { ClientRepositoryEntity } from './client.repository.entity';
import { Status } from '@/domain/enum/status.enum';
import { Roles } from '@/domain/enum/role.enum';

@Entity('user')
export class UserRepositoryEntity {
  @PrimaryColumn('uuid', {
    default: () => 'uuid_generate_v7()',
  })
  @Index()
  id: string;

  @Column({ type: 'varchar', length: 50 })
  fullname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  username: string;

  @Column({ type: 'bigint', nullable: true })
  last_access: number;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  @Index()
  status: Status;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

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

  @OneToMany(() => ClientRepositoryEntity, (client) => client.user)
  clients: ClientRepositoryEntity[];
}
