import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

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
}
