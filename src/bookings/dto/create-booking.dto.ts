import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  booking_id: number;
  user_id: number;
  package_id: number;
  booking_date: Date;
  status?: BookingStatus; // Optional field using BookingStatus enum
}
