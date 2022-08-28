import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { School } from './school.entity';
import { User } from './user.entity';

@Entity()
export class Subscribe {
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @ManyToOne(() => User, (user) => user.subscribe)
  user: User;

  @PrimaryColumn()
  @RelationId((subscribe: Subscribe) => subscribe.user)
  userId: number;

  @JoinColumn({ name: 'schoolId', referencedColumnName: 'id' })
  @ManyToOne(() => School, (school) => school.subscribe)
  school: School;

  @PrimaryColumn()
  @RelationId((subscribe: Subscribe) => subscribe.school)
  schoolId: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
