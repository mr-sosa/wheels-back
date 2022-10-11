import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
export class OpinionDto {
  @IsNotEmpty()
  @IsString()
  readonly comment: string;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  readonly date: Date;

  @IsNotEmpty()
  @IsString()
  readonly score: string;
}
