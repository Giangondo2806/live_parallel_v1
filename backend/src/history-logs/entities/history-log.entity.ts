import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActionType } from '../../common/types';
import { IdleResource } from '../../idle-resources/entities/idle-resource.entity';
import { User } from '../../users/entities/user.entity';

@Entity('history_logs')
export class HistoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  resourceId: number;

  @ManyToOne(() => IdleResource, { nullable: true })
  @JoinColumn({ name: 'resourceId' })
  resource: IdleResource;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @Column({ type: 'text', nullable: true })
  oldValues: string;

  @Column({ type: 'text', nullable: true })
  newValues: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  changedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedBy' })
  changedByUser: User;

  @CreateDateColumn()
  changedAt: Date;

  @Column({ nullable: true })
  entityType: string; // 'resource', 'user', 'cv_file', etc.

  @Column({ nullable: true })
  entityId: number;
}
