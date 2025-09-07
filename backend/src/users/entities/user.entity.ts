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
import { UserRole } from '../../common/types';
import { Department } from '../../departments/entities/department.entity';
import { IdleResource } from '../../idle-resources/entities/idle-resource.entity';
import { CVFile } from '../../cv-files/entities/cv-file.entity';
import { HistoryLog } from '../../history-logs/entities/history-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(() => Department, { nullable: true, eager: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => IdleResource, resource => resource.createdByUser)
  createdResources: IdleResource[];

  @OneToMany(() => IdleResource, resource => resource.updatedByUser)
  updatedResources: IdleResource[];

  @OneToMany(() => CVFile, cvFile => cvFile.uploadedByUser)
  uploadedFiles: CVFile[];

  @OneToMany(() => HistoryLog, log => log.changedByUser)
  historyLogs: HistoryLog[];
}
