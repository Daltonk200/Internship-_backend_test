import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
