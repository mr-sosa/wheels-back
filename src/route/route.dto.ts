import { IsNotEmpty, IsNumber } from 'class-validator';
export class RouteDto {
  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @IsNotEmpty()
  @IsNumber()
  readonly distance: number;
}
