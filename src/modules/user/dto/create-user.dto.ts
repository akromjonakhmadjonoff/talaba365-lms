import {
  IsEmail, IsOptional, IsString, IsBoolean, IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
    user_name: string;

  @IsString()
    full_name: string;

  @IsEmail()
    email: string;

  @IsString()
    password_hash: string;

  @IsOptional()
  @IsString()
    profile_image_url?: string;

  @IsOptional()
  @IsString()
    phone_number?: string;

  @IsOptional()
    gender?: string;

  @IsOptional()
  @IsDateString()
    date_of_birth?: Date;

  @IsOptional()
  @IsBoolean()
    is_active?: boolean;

  @IsOptional()
  @IsDateString()
    last_login_at?: Date;

  @IsString()
    timezone: string;

  @IsString()
    bio: string;
}
