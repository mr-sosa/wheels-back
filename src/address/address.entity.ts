import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PointEntity } from '../point/point.entity';

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  department: string;

  @Column()
  city: string;

  @Column()
  location: string;

  @Column()
  name: string;

  @Column()
  mainRoad: string;

  @Column()
  firstNumber: number;

  @Column()
  firstLetter: string;

  @Column()
  fisrtQuadrant: string;

  @Column()
  secondNumber: number;

  @Column()
  secondLetter: string;

  @Column()
  secondQuadrant: string;

  @Column()
  plateNumber: number;

  @Column()
  description: string;

  /*
  User
  */
  @ManyToMany(() => UserEntity, (users) => users.addresses)
  users: UserEntity[];

  /*
  PassengerTravel
  */
  @OneToMany(
    () => PassengerTravelEntity,
    (originPassengerTravels) => originPassengerTravels.origin,
  )
  originPassengerTravels: PassengerTravelEntity[];

  @OneToMany(
    () => PassengerTravelEntity,
    (destinationPassengerTravels) => destinationPassengerTravels.destination,
  )
  destinationPassengerTravels: PassengerTravelEntity[];

  /*
  DriverTravel
  */
  @OneToMany(() => DriverTravelEntity, (driverTravels) => driverTravels.origin)
  originDriverTravels: DriverTravelEntity[];

  @OneToMany(
    () => DriverTravelEntity,
    (driverTravels) => driverTravels.destination,
  )
  destinationDriverTravels: DriverTravelEntity[];

  /*
  Point
  */
  @JoinColumn()
  @OneToOne(() => PointEntity, (point) => point.address)
  point: PointEntity;
}
