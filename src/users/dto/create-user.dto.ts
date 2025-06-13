import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsNumber,
  IsEmpty,
} from 'class-validator';
import { status } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'user email'})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'user password'})
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ description: 'user first name'})
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'user last name'})
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({description: 'user status'})
  status: status;

  @ApiProperty({description: 'User phone number'})
  @IsNotEmpty()
  phone_number: string;

  // @IsNotEmpty()
  // profile: string;

  
}
