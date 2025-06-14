import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import { Booking, BookingStatus } from 'src/bookings/entities/booking.entity';
//import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { Inquiry, status } from 'src/inquiries/entities/inquiry.entity';
import {
  Profile,
  UserRole as ProfileUserRole,
} from 'src/profiles/entities/profile.entity';
import { Ticket, ticket_status } from 'src/tickets/entities/ticket.entity';
import { TourPackage } from 'src/tour_packages/entities/tour_package.entity';
import {
  User,
  status as UserStatus,
  UserRole as UserUserRole,
} from 'src/users/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { response } from 'express';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly BATCH_SIZE = 500;
  private readonly TOTAL_RECORDS = 50;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TourPackage)
    private readonly tourPackageRepository: Repository<TourPackage>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(GuestUser)
    private readonly guestUserRepository: Repository<GuestUser>,
  ) {}

  async seed(): Promise<void> {
    await this.seedUsers();
    await this.seedTourPackages();
    await this.seedTickets();
    await this.seedProfiles();
    await this.seedInquiries();
    //await this.seedGuestUsers();
    await this.seedBookings();
    //await this.seedAdmins();
    this.logger.log('Starting seeding...');
  }

  private async seedUsers() {
    this.logger.log('Started seeding users...');
    let userIndex = 1;
    const statuses = Object.values(UserStatus);
    const roles = Object.values(UserUserRole);
    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const users = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = this.userRepository.create({
          email: `user${userIndex}@gmail.com`,
          password: faker.internet.password(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          role: roles[Math.floor(Math.random() * roles.length)],
          phone_number: faker.phone.number(),
          last_login: faker.date.future(),
          hashedRefreshToken: faker.string.uuid(),
        });
        userIndex++;
        return user;
      });

      try {
        await this.userRepository.save(users);
        this.logger.log(
          `Saved batch ${i / this.BATCH_SIZE + 1} (${userIndex - 1} users total)`,
        );
      } catch (error) {
        this.logger.error(
          `Failed tosave batch ${i / this.BATCH_SIZE + 1}`,
          error,
        );
      }
      await new Promise((response) => setTimeout(response, 100)); // Delay to avoid Database overload.
    }
    this.logger.log('😁Finished seeding all users!');
  }

  private async seedTourPackages() {
    this.logger.log('Started seeding tour packages...');
    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const tour_packages = Array.from({ length: this.BATCH_SIZE }, () =>
        this.tourPackageRepository.create({
          package_name: faker.company.catchPhrase(),
          description: faker.lorem.paragraph(),
          price: +faker.commerce.price({ min: 100, max: 15000 }),
          duration: faker.number.int({ min: 1, max: 14 }),
          available_slots: faker.number.int({ min: 1, max: 25 }),
          start_date: faker.date.soon({ days: 60 }),
          end_date: faker.date.soon({ days: 120 }),
        }),
      );
      await this.tourPackageRepository.save(tour_packages);
      this.logger.log(`Saved tour packages batch ${i / this.BATCH_SIZE + 1}`);
    }
  }

  private async seedTickets() {
    this.logger.log('Started seeding tickets...');
    const bookingIds = await this.bookingRepository.find({
      select: ['booking_id'],
    });
    const packageIds = await this.tourPackageRepository.find({
      select: ['package_id'],
    });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const ticketStatuses = Object.values(ticket_status);
      const tickets = Array.from({ length: this.BATCH_SIZE }, () => {
        const booking = faker.helpers.arrayElement(bookingIds);
        const tour_package = faker.helpers.arrayElement(packageIds);
        return this.ticketRepository.create({
          booking_id: booking.booking_id,
          issue_description: faker.lorem.paragraph(),
          ticket_status:
            ticketStatuses[Math.floor(Math.random() * ticketStatuses.length)],
          created_at: faker.date.timeZone(),
          resolved_at: faker.date.timeZone(),
        });
      });
      await this.ticketRepository.save(tickets);
      this.logger.log(
        `Tickets batch ${i / this.BATCH_SIZE + 1} saved succesfully!`,
      );
    }
  }

  private async seedProfiles() {
    this.logger.log('Started seeding profiles...');
    for (let i = 0; i < 50; i++) {
      const profile = new Profile();
      profile.first_name = faker.person.firstName();
      profile.last_name = faker.person.lastName();
      profile.email = faker.internet.email({
        firstName: profile.first_name,
        lastName: profile.last_name,
        provider: 'tourism.org',
      });
      profile.role = UserUserRole.USER;
      const savedProfile = await this.profileRepository.save(profile);
    }
  }

  private async seedInquiries() {
    this.logger.log('Started Seeding inquiries...');
    const userIds = await this.userRepository.find({ select: ['User_id'] });
    const GuestUserIds = await this.guestUserRepository.find({
      select: ['guest_id'],
    });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const inquiryStatuses = Object.values(status);
      const inquiries = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = faker.helpers.arrayElement(userIds);
        const GuestUser = faker.helpers.arrayElement(GuestUserIds);
        return this.inquiryRepository.create({
          //guest_id: GuestUser.guest_id,
          user_id: user.User_id,
          inquiry_type: faker.lorem.text(),
          message: faker.lorem.paragraph(),
          status:
            inquiryStatuses[Math.floor(Math.random() * inquiryStatuses.length)],
          created_at: faker.date.anytime(),
        });
      });
      await this.inquiryRepository.save(inquiries);
      this.logger.log(`Inquiries batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }

  private async seedBookings() {
    this.logger.log('Seeding bookings...');
    const userIds = await this.userRepository.find({ select: ['User_id'] });
    const packageIds = await this.tourPackageRepository.find({
      select: ['package_id'],
    });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const bookings = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = faker.helpers.arrayElement(userIds);
        const tourPackage = faker.helpers.arrayElement(packageIds);

        return this.bookingRepository.create({
          booking_date: faker.date.future(),
          status: faker.helpers.arrayElement(Object.values(BookingStatus)),
          user: { User_id: user.User_id }, // or just user if you want to attach the entity
          package: { package_id: tourPackage.package_id }, // or just tourPackage
        });
      });

      await this.bookingRepository.save(bookings);
      this.logger.log(`Bookings batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }
}
