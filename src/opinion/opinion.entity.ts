/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class OpinionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column()
  date: Date;

  @Column()
  score: string;

  /*
   * User
   */

  @ManyToMany(() => UserEntity, (user) => user.opinionsReceived)
  users: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.opinionsMade)
  commentators: UserEntity[];
}
