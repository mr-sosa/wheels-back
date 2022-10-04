import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Entity()
export class PreferenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  /*
  User
  */
  @ManyToMany(() => UserEntity, (users) => users.preferences)
  users: UserEntity[];

  /*
  DriverTravel
  */
  @ManyToMany(
    () => DriverTravelEntity,
    (driverTravels) => driverTravels.preferences,
  )
  driverTravels: DriverTravelEntity[];
}
