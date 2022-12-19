import { ApiProperty } from '@nestjs/swagger/dist';
import { IsNotEmpty, IsString, IsDateString, IsUrl } from 'class-validator';

export class VehicleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly licensePlate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly brand: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly serie: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly model: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly soatExpedition: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly soatExpiration: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  readonly photo: string;
}
