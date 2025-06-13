import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserRole } from '../entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ description: 'First name of the user.'})
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name of the user.'})
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'users email'})
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ description: 'user password.'})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'user role'})
  @IsEnum(UserRole, {
    message: 'Role must be either user or admin!',
  })
  role: UserRole = UserRole.GUEST;

  @IsUUID()
  userId: number;
}
