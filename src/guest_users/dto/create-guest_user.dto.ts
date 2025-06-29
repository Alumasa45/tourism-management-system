import { N } from '@faker-js/faker/dist/airline-BUL6NtOJ';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsNumber,
  IsEmpty,
} from 'class-validator';

export class CreateGuestUserDto {
  @ApiProperty({ description: 'Unique guest Identifier.'})
    @IsNumber()
    @IsNotEmpty()
    guest_id: number;

    @ApiProperty({ description: 'guest user email.'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'guest user first name.'})
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ description: 'guest user last name.'})
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({ description: 'guest user phone number.'})
    @IsNotEmpty()
    phone_number: string;
}
