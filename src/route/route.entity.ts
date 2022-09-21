import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { StepEntity } from '../step/step.entity';

@Entity()
export class RouteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  duration: Number;

  @Column()
  distance: Number;

  /*
  DriverTravel
  */
  @ManyToOne(() => DriverTravelEntity, (driverTravel) => driverTravel.routes)
  driverTravel: DriverTravelEntity;

  /*
  Step
  */
  @OneToMany(() => StepEntity, (steps) => steps.route)
  steps: StepEntity[];
}
