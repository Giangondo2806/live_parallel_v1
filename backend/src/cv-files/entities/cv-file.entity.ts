import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IdleResource } from '../../idle-resources/entities/idle-resource.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cv_files')
export class CVFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resourceId: number;

  @ManyToOne(() => IdleResource, resource => resource.cvFiles)
  @JoinColumn({ name: 'resourceId' })
  resource: IdleResource;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 500 })
  filePath: string;

  @Column({ length: 20 })
  fileType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ length: 255, nullable: true })
  originalName: string;

  @Column()
  uploadedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedBy' })
  uploadedByUser: User;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
