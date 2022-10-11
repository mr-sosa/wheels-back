import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
export class PassengerTravelDto {
  @IsNotEmpty()
  @IsNumber()
  readonly cost: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quota: number;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly date: Date;

  @IsNotEmpty()
  @IsString()
  readonly state: string;
}
