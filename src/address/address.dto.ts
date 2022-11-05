import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class AddressDto {
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly department: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly location: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly mainRoad: string;

  @IsNotEmpty()
  @IsNumber()
  readonly firstNumber: number;

  @IsString()
  readonly firstLetter: string;

  @IsString()
  readonly fisrtQuadrant: string;

  @IsNotEmpty()
  @IsNumber()
  readonly secondNumber: number;

  @IsString()
  readonly secondLetter: string;

  @IsString()
  readonly secondQuadrant: string;

  @IsNotEmpty()
  @IsNumber()
  readonly plateNumber: number;

  @IsString()
  readonly description: string;
}
