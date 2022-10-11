import { IsNotEmpty, IsString } from 'class-validator';
export class PreferenceDto {
  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
