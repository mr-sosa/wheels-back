import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly genre: string;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly birthDate: Date;

  @IsUrl()
  readonly photo: string;

  @IsString()
  readonly idenficiationCard: string;

  @IsString()
  readonly about: string;

  @IsNumber()
  readonly score: number;

  @IsString()
  readonly drivingPass: string;
}
