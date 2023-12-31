import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RouteEntity } from '../route/route.entity';
import { PointEntity } from '../point/point.entity';

@Entity()
export class StepEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  duration: number;

  @Column()
  distance: number;

  /*
  Route
  */
  @ManyToOne(() => RouteEntity, (route) => route.steps)
  route: RouteEntity;

  /*
  Point
  */
  @JoinColumn()
  @OneToOne(() => PointEntity, (startPoint) => startPoint.stepStart)
  startPoint: PointEntity;

  @JoinColumn()
  @OneToOne(() => PointEntity, (endPoint) => endPoint.stepEnd)
  endPoint: PointEntity;
}
