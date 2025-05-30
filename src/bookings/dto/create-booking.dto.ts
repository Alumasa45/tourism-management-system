export class CreateBookingDto {
  booking_id: number;
  user_id: number;
  package_id: number;
  booking_date: Date;
  status: 'confirmed' | 'cancelled';
}
