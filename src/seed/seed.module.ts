import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from 'src/users/entities/user.entity';
import { TourPackage } from 'src/tour_packages/entities/tour_package.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Inquiry } from 'src/inquiries/entities/inquiry.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, TourPackage, Ticket, Profile, Inquiry, GuestUser, Booking, Admin])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
