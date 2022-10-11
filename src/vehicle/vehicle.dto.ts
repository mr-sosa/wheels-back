import { IsNotEmpty, IsString, IsDateString, IsUrl } from 'class-validator';

export class VehicleDto {
  @IsNotEmpty()
  @IsString()
  readonly licensePlate: string;

  @IsNotEmpty()
  @IsString()
  readonly brand: string;

  @IsNotEmpty()
  @IsString()
  readonly serie: string;

  @IsNotEmpty()
  @IsString()
  readonly model: string;

  @IsNotEmpty()
  @IsString()
  readonly color: string;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly soatExpedition: Date;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly soatExpiration: Date;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNotEmpty()
  @IsUrl()
  readonly photo: string;
}
