import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { School } from './school.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;

  @ManyToOne(() => School, (school) => school.feed, { nullable: false })
  school: School;

  @RelationId((feed: Feed) => feed.school)
  schoolId: number;
}
