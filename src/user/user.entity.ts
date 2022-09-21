import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { PreferenceEntity } from '../preference/preference.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: String;

  @Column()
  password: String;

  @Column()
  name: String;

  @Column()
  phone: String;

  @Column()
  genre: String;

  @Column()
  birthDate: Date;

  @Column()
  photo: String;

  @Column()
  idenficiationCard: String;

  @Column()
  about: String;

  @Column()
  score: Number;

  @Column()
  drivingPass: String;

  @Column()
  isDriver: Boolean;

  @Column()
  state: String;

  @Column()
  verifiedMail: Boolean;

  @Column()
  verifiedPhone: Boolean;

  @Column()
  verifiedIC: Boolean;

  @Column()
  verifiedDrivingPass: Boolean;

  @Column()
  verifiedUser: Boolean;

  @JoinTable()
  @ManyToMany(() => AddressEntity, (addresses) => addresses.users)
  addresses: AddressEntity[];

  @JoinTable()
  @ManyToMany(() => PreferenceEntity, (preferences) => preferences.users)
  preferences: PerformanceEntry[];

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.user)
  vehicles: VehicleEntity[];

  @OneToMany(() => DriverTravelEntity, (driverTravels) => driverTravels.driver)
  driverTravelsByDriver: DriverTravelEntity[];

  @ManyToOne(
    () => DriverTravelEntity,
    (driverTravel) => driverTravel.passengers,
  )
  driverTravelByPassenger: DriverTravelEntity;
}
