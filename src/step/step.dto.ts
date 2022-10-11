import { IsNotEmpty, IsNumber } from 'class-validator';
export class StepDto {
  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @IsNotEmpty()
  @IsNumber()
  readonly distance: number;
}
