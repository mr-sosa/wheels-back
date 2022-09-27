import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PreferenceEntity } from '../preference/preference.entity';
import { UserEntity } from '../user/user.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';
import { AddressEntity } from '../address/address.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { RouteEntity } from '../route/route.entity';

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

  /*
  Preference
  */
  @JoinTable()
  @ManyToMany(
    () => PreferenceEntity,
    (preferences) => preferences.driverTravels,
  )
  preferences: PerformanceEntry[];

  /*
  User
  */
  @ManyToOne(() => UserEntity, (user) => user.driverTravelsByDriver)
  driver: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.driverTravelByPassenger)
  passengers: UserEntity[];

  /*
  Vehicle
  */
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.driverTravels)
  vehicle: VehicleEntity;

  /*
  Address
  */
  @ManyToOne(() => AddressEntity, (origin) => origin.originDriverTravels)
  origin: AddressEntity;

  @ManyToOne(
    () => AddressEntity,
    (destination) => destination.destinationDriverTravels,
  )
  destination: AddressEntity;

  /*
  PassengerTravel
  */
  @OneToMany(
    () => PassengerTravelEntity,
    (passengerTravels) => passengerTravels.driverTravel,
  )
  passengerTravels: PassengerTravelEntity;

  /*
  Route
  */
  @OneToMany(() => RouteEntity, (routes) => routes.driverTravel)
  routes: RouteEntity[];
}
