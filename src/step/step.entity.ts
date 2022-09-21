import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RouteEntity } from '../route/route.entity';

@Entity()
export class StepEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  duration: Number;

  @Column()
  distance: Number;

  /*
  Route
  */
  @ManyToOne(() => RouteEntity, (route) => route.steps)
  route: RouteEntity;
}
