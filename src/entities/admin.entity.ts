import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { School } from './school.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({ unique: true })
  account: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToOne(() => School, (school) => school.admin, { nullable: true })
  @Exclude()
  school: School;
}
