import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VehicleEntity } from '../vehicle/vehicle.entity';

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

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.user)
  vehicles: VehicleEntity[];
}
