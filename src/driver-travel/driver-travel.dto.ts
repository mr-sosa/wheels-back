import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
export class DriverTravelDto {
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  spaceAvailable: number;

  @IsNotEmpty()
  @IsString()
  state: string;
}
