import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: String;

  @Column()
  department: String;

  @Column()
  city: String;

  @Column()
  location: String;

  @Column()
  name: String;

  @Column()
  mainRoad: String;

  @Column()
  firstNumber: Number;

  @Column()
  firstLetter: String;

  @Column()
  fisrtQuadrant: String;

  @Column()
  secondNumber: Number;

  @Column()
  secondLetter: String;

  @Column()
  secondQuadrant: String;

  @Column()
  plateNumber: Number;

  @Column()
  description: String;

  @ManyToMany(() => UserEntity, (users) => users.addresses)
  users: UserEntity[];

  @OneToMany(() => DriverTravelEntity, (driverTravels) => driverTravels.origin)
  originDriverTravels: DriverTravelEntity[];

  @OneToMany(
    () => DriverTravelEntity,
    (driverTravels) => driverTravels.destination,
  )
  destinationDriverTravels: DriverTravelEntity[];
}
