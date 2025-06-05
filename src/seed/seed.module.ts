import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Inquiry } from 'src/inquiries/entities/inquiry.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { TourPackage } from 'src/tour_packages/entities/tour_package.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Inquiry, Ticket, TourPackage, User]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
