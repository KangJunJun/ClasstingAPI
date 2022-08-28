import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  Column,
  OneToMany,
  OneToOne,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { Subscribe } from './subscribe.entity';
import { Admin } from './admin.entity';
import { Feed } from './feed.entity';

@Entity()
@Unique(['name', 'region'])
export class School {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  name: string;

  @Column()
  region: string;

  @OneToMany(() => Subscribe, (subscribe) => subscribe.school)
  subscribe: Subscribe[];

  @OneToOne(() => Admin, (admin) => admin.school)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @RelationId((school: School) => school.admin)
  adminId: number;

  @OneToMany(() => Feed, (feed) => feed.school)
  feed: Feed[];
}
