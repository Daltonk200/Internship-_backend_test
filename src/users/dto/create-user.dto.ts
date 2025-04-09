import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2)
  name: string;

  @IsEmail()
  email: string;
}
