import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscribe } from './subscribe.entity';

@Entity()
export class User {
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

  @OneToMany(() => Subscribe, (subscribe) => subscribe.user, { lazy: true })
  subscribe: Subscribe[];
}
