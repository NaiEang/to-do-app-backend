import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsEmail()
  email: string;
}
