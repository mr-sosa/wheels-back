import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Entity()
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  licensePlate: string;

  @Column()
  brand: string;

  @Column()
  serie: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  soatExpedition: Date;

  @Column()
  soatExpiration: Date;

  @Column()
  type: string;

  @Column()
  photo: string;

  /*
  User
  */
  @ManyToOne(() => UserEntity, (user) => user.vehicles)
  user: UserEntity;

  /*
  DriverTravel
  */
  @ManyToOne(() => DriverTravelEntity, (driverTravels) => driverTravels.vehicle)
  driverTravels: DriverTravelEntity[];
}
