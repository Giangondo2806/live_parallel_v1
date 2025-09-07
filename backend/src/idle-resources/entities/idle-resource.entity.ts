import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ResourceStatus } from '../../common/types';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { CVFile } from '../../cv-files/entities/cv-file.entity';
import { HistoryLog } from '../../history-logs/entities/history-log.entity';

@Entity('idle_resources')
export class IdleResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  employeeCode: string;

  @Column({ length: 100 })
  fullName: string;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ length: 100 })
  position: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  skillSet: string;

  @Column({ type: 'date' })
  idleFrom: Date;

  @Column({ type: 'date', nullable: true })
  idleTo: Date;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.IDLE,
  })
  status: ResourceStatus;

  @Column({ type: 'text', nullable: true })
  processNote: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rate: number;

  @Column()
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @Column()
  updatedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  updatedByUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => CVFile, cvFile => cvFile.resource)
  cvFiles: CVFile[];

  @OneToMany(() => HistoryLog, log => log.resource)
  historyLogs: HistoryLog[];

  // Virtual property for urgent status (idle >= 2 months)
  get isUrgent(): boolean {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return new Date(this.idleFrom) <= twoMonthsAgo;
  }
}
