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
  brand: String;

  @Column()
  serie: String;

  @Column()
  model: String;

  @Column()
  color: String;

  @Column()
  soatExpedition: Date;

  @Column()
  soatExpiration: Date;

  @Column()
  type: String;

  @Column()
  photo: String;

  @ManyToOne(() => UserEntity, (user) => user.vehicles)
  user: UserEntity;

  @ManyToOne(() => DriverTravelEntity, (driverTravels) => driverTravels.vehicle)
  driverTravels: DriverTravelEntity[];
}
