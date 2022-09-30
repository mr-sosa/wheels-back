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
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { OpinionEntity } from '../opinion/opinion.entity';

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

  /*
  Address
  */
  @JoinTable()
  @ManyToMany(() => AddressEntity, (addresses) => addresses.users)
  addresses: AddressEntity[];

  /*
  Preference
  */
  @JoinTable()
  @ManyToMany(() => PreferenceEntity, (preferences) => preferences.users)
  preferences: PerformanceEntry[];

  /*
  PassengerTravel
  */
  @JoinTable()
  @ManyToMany(
    () => PassengerTravelEntity,
    (passengerTravels) => passengerTravels.passengers,
  )
  passengerTravels: PassengerTravelEntity[];

  /*
  Vehicle
  */
  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.user)
  vehicles: VehicleEntity[];

  /*
  DriverTravel
  */
  @OneToMany(() => DriverTravelEntity, (driverTravels) => driverTravels.driver)
  driverTravelsByDriver: DriverTravelEntity[];

  @ManyToOne(
    () => DriverTravelEntity,
    (driverTravel) => driverTravel.passengers,
  )
  driverTravelByPassenger: DriverTravelEntity;

  /*
  Opinion
  */
  @JoinTable()
  @ManyToMany(() => OpinionEntity, (opinionsReceived) => opinionsReceived.users)
  opinionsReceived: OpinionEntity[];

  @JoinTable()
  @ManyToMany(() => OpinionEntity, (opinionsMade) => opinionsMade.commentators)
  opinionsMade: OpinionEntity[];
}
