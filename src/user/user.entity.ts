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
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  genre: string;

  @Column()
  birthDate: Date;

  @Column()
  photo: string;

  @Column()
  idenficiationCard: string;

  @Column()
  about: String;

  @Column()
  score: Number;

  @Column()
  drivingPass: string;

  @Column()
  isDriver: boolean;

  @Column()
  state: string;

  @Column()
  verifiedMail: boolean;

  @Column()
  verifiedPhone: boolean;

  @Column()
  verifiedIC: boolean;

  @Column()
  verifiedDrivingPass: boolean;

  @Column()
  verifiedUser: boolean;

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
  preferences: PreferenceEntity[];

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
