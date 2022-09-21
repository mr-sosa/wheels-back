import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PreferenceEntity } from 'src/preference/preference.entity';
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

  @JoinTable()
  @ManyToMany(
    () => PreferenceEntity,
    (preferences) => preferences.driverTravels,
  )
  preferences: PerformanceEntry[];

  @ManyToOne(() => UserEntity, (user) => user.driverTravelsByDriver)
  driver: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.driverTravelByPassenger)
  passengers: UserEntity[];

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.driverTravels)
  vehicle: VehicleEntity;
}
