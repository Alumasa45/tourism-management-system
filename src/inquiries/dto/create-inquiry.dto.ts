import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsNumber,
} from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({ description: 'Unique inquiry identifier.'})
  @IsNotEmpty()
  @IsNumber()
  inquiry_id: number;

  @ApiProperty({description: 'guest_id FK.'})
  @IsNumber()
  @IsNotEmpty()
  guest_id?: number;

  @ApiProperty({ description: 'user_id FK.'})
  @IsNumber()
  @IsNotEmpty()
  user_id?: number;

  @ApiProperty({ description: 'Type of inquiry made.'})
  @IsNotEmpty()
  inquiry_type: string;

  @ApiProperty({ description: 'Inquiry message.'})
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Inquiry status.'})
  status: 'open' | 'closed' | 'resolved';

  @ApiProperty({description: 'timme the inquiry was submitted.'})
  @IsDate()
  created_at?: Date;
}
