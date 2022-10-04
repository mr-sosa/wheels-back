import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AddressEntity } from '../address/address.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Entity()
export class PassengerTravelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cost: number;

  @Column()
  quota: number;

  @Column()
  date: Date;

  @Column()
  state: string;

  /*
  User
  */
  @ManyToMany(() => UserEntity, (passengers) => passengers.passengerTravels)
  passengers: UserEntity[];

  /*
  Address
  */
  @ManyToOne(() => AddressEntity, (origin) => origin.originPassengerTravels)
  origin: AddressEntity;

  @ManyToOne(
    () => AddressEntity,
    (destination) => destination.destinationPassengerTravels,
  )
  destination: AddressEntity;

  /*
  DriverTravel
  */
  @ManyToOne(
    () => DriverTravelEntity,
    (driverTravel) => driverTravel.passengerTravels,
  )
  driverTravel: DriverTravelEntity;
}
