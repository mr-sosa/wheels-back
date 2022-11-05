import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
export class DriverTravelDto {
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly date: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly spaceAvailable: number;
}
