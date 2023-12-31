import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { StepEntity } from '../step/step.entity';
import { AddressEntity } from '../address/address.entity';

@Entity()
export class PointEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  /*
  Step
  */
  @OneToOne(() => StepEntity, (stepStart) => stepStart.startPoint)
  stepStart: StepEntity;

  @OneToOne(() => StepEntity, (stepEnd) => stepEnd.endPoint)
  stepEnd: StepEntity;

  /*
  Address
  */
  @OneToOne(() => AddressEntity, (address) => address.point)
  address: AddressEntity;
}
