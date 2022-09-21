import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';

@Entity()
export class DriverTravelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  spaceAvailable: Number;

  @Column()
  state: String;

  @ManyToOne(() => UserEntity, (user) => user.driverTravelsByDriver)
  driver: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.driverTravelByPassenger)
  passengers: UserEntity[];

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.driverTravels)
  vehicle: VehicleEntity;
}
