import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Entity()
export class PreferenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: String;

  @ManyToMany(() => UserEntity, (users) => users.preferences)
  users: UserEntity[];

  @ManyToMany(
    () => DriverTravelEntity,
    (driverTravels) => driverTravels.preferences,
  )
  driverTravels: DriverTravelEntity[];
}
