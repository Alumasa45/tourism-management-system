import { Injectable, Logger } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { read, stat } from 'fs';
import { status, User } from 'src/users/entities/user.entity';
import { TourPackage } from 'src/tour_packages/entities/tour_package.entity';
import { Inquiry } from 'src/inquiries/entities/inquiry.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { last } from 'rxjs';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(TourPackage)
    private readonly tourPackageRepository: Repository<TourPackage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    this.logger.log('Seeding database...');

    try {
      this.logger.log('Clearing existing data...');
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.query('DELETE FROM bookings');
        await queryRunner.query('DELETE FROM inquiries');
        await queryRunner.query('DELETE FROM tickets');
        await queryRunner.query('DELETE FROM tour_packages');
        await queryRunner.query('DELETE FROM users');

        await queryRunner.commitTransaction();
        this.logger.log('Existing data cleared successfully.');
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Error clearing existing data:', error);
        throw error;
      } finally {
        await queryRunner.release();
      }

      //seeding users.
      await this.seedUsers();
      //seeding tour packages.
      await this.seedTourPackages();
      //seeding bookings.
      await this.seedBookings();
      //seeding inquiries.
      await this.seedInquiries();
      //seeding tickets.
      await this.seedTickets();

      this.logger.log('Database seeding completed successfully.');
      return { message: 'Database seeding completed successfully.' };
    } catch (error) {
      this.logger.error('Error seeding database:', error);
      throw error;
    }
  }

  async seedUsers() {
    this.logger.log('Seeding Users...');
    const hashedPassword = await bcrypt.hash('password', 12);

    const users = [
      {
        email: 'admin@example.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        status: status.Active,
        phone_number: '0111111111',
        last_login: new Date().toISOString().split('T')[0],
      },
      {
        email: 'queen@gmail.com',
        password: hashedPassword,
        first_name: 'Queen',
        last_name: 'Akinyi',
        status: status.Active,
        phone_number: '0121111111',
        last_login: new Date().toISOString().split('T')[0],
      },
      {
        email: 'Samurai@gmail.com',
        password: hashedPassword,
        first_name: 'Samurai',
        last_name: 'Yen',
        status: status.Active,
        phone_number: '0131111111',
        last_login: new Date().toISOString().split('T')[0],
      },
      {
        email: 'Forty@gmail.com',
        password: hashedPassword,
        first_name: 'Forty',
        last_name: 'Quinn',
        status: status.Active,
        phone_number: '0141111111',
        last_login: new Date().toISOString().split('T')[0],
      },
    ];
    await this.userRepository.save(users);
    this.logger.log('Users seeded successfully.');
  }

  async seedTourPackages() {
    this.logger.log('Seeding tour packages...');

    const tourPackages = [
      {
        name: 'Hiking Adventure',
        description: 'Enjoy a thrilling hike through the mountains.',
        price: 100,
        duration: 5,
        location: 'Mountains',
        image_url: 'hiking.jpeg',
        created_at: new Date(),
      },
      {
        name: 'Cultural Tour',
        description: 'Explore the rich history of the city.',
        price: 150,
        duration: 3,
        location: 'City',
        image_url: 'cultural.jpeg',
        created_at: new Date(),
      },
      {
        name: 'Beach Vacation',
        description: 'Relax and enjoy the sun on the beach.',
        price: 200,
        duration: 7,
        location: 'Beach',
        image_url: 'beach.jpeg',
        created_at: new Date(),
      },
      {
        name: 'City Tour',
        description: "Discover the city's history and attractions.",
        price: 120,
        duration: 4,
        location: 'City',
        image_url: 'city.jpeg',
        created_at: new Date(),
      },
    ];
    await this.tourPackageRepository.save(tourPackages);
    this.logger.log('Tour packages seeded successfully.');
  }

  async seedBookings() {
    this.logger.log('Seeding bookings...');

    const users = await this.userRepository.find();
    const tourPackages = await this.tourPackageRepository.find();

    if (users.length === 0 || tourPackages.length === 0) {
      this.logger.error(
        'No users or tour packages found. Cannot complete booking seeding.',
      );
      return;
    }

    const booking = [
      {
        user: users[0],
        package: tourPackages[0],
        booking_date: new Date(),
        status: 'pending',
        guests: 3,
        total_price: tourPackages[0].price * 3,
      },
      {
        user: users[1],
        package: tourPackages[1],
        booking_date: new Date(),
        status: 'pending',
        guests: 2,
        total_price: tourPackages[1].price * 2,
      },
      {
        user: users[2],
        package: tourPackages[2],
        booking_date: new Date(),
        status: 'pending',
        guests: 4,
        total_price: tourPackages[2].price * 4,
      },
      {
        user: users[3],
        package: tourPackages[3],
        booking_date: new Date(),
        status: 'pending',
        guests: 1,
        total_price: tourPackages[3].price * 1,
      },
    ];

    // await this.bookingRepository.save(booking);
    this.logger.log('Bookings seeded successfully.');
  }

  async seedInquiries() {
    this.logger.log('Seeding inquiries...');

    const users = await this.userRepository.find();
    if (users.length === 0) {
      this.logger.error('No users found. Cannot complete inquiry seeding.');
      return;
    }

    const inquiries = [
      {
        users: users[0],
        inquiry_type: 'general',
        message: 'I would like to book a tour package.',
        status: 'pending',
        created_at: new Date(),
      },
      {
        users: users[1],
        inquiry_type: 'general',
        message: 'I have a question about my booking.',
        status: 'pending',
        created_at: new Date(),
      },
      {
        users: users[2],
        inquiry_type: 'general',
        message: 'I would like to cancel my booking.',
        status: 'pending',
        created_at: new Date(),
      },
    ];
    await this.inquiryRepository.save(inquiries);
    this.logger.log('Inquiries seeded successfully.');
  }

  async seedTickets() {
    this.logger.log('Seeding tickets...');

    const users = await this.userRepository.find();
    const bookings = await this.bookingRepository.find();

    if (users.length === 0 || bookings.length === 0) {
      this.logger.error(
        'No users or bookings found. Cannot complete ticket seeding.',
      );
      return;
    }

    const tickets = [
      {
        user: users[0],
        booking: bookings[0],
        issue_description: 'Help me change the booking date.',
        status: 'open',
        created_at: new Date(),
      },
      {
        user: users[1],
        booking: bookings[1],
        issue_description: 'I need assistance with my booking.',
        status: 'open',
        created_at: new Date(),
      },
      {
        user: users[2],
        booking: bookings[2],
        issue_description: 'I would like to cancel my booking.',
        status: 'open',
        created_at: new Date(),
      },
    ];

    await this.ticketRepository.save(tickets);
    this.logger.log('Tickets seeded successfully.');
  }
}
