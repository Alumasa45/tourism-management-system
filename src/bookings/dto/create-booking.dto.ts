import { BookingStatus } from '../entities/booking.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsNumber()
  booking_id: number;

  @ApiProperty({ description: 'User ID making the booking' })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ description: 'Tour package ID being booked' })
  @IsNumber()
  @IsNotEmpty()
  package_id: number;

  @ApiProperty({ description: 'Date of booking' })
  @IsDate()
  booking_date: Date;

  @ApiPropertyOptional({ 
    description: 'Booking status',
    enum: BookingStatus,
    default: BookingStatus.Pending
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
