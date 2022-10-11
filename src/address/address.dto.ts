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

  @IsNotEmpty()
  @IsString()
  readonly firstLetter: string;

  @IsNotEmpty()
  @IsString()
  readonly fisrtQuadrant: string;

  @IsNotEmpty()
  @IsNumber()
  readonly secondNumber: number;

  @IsNotEmpty()
  @IsString()
  readonly secondLetter: string;

  @IsNotEmpty()
  @IsString()
  readonly secondQuadrant: string;

  @IsNotEmpty()
  @IsNumber()
  readonly plateNumber: number;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
