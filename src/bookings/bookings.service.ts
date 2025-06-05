import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      const bookingStatus = createBookingDto.status || BookingStatus.Pending;

      const booking: Booking = this.bookingRepository.create({
        ...createBookingDto,
        booking_date: new Date(createBookingDto.booking_date),
        status: bookingStatus,
      });

      return await this.bookingRepository.save(booking);
    } catch (error) {
      throw new BadRequestException('Failed to create booking!');
    }
  }
  // Pagination Implementation.
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    booking: Booking[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      relations: ['tour_packages', 'User'],
      order: { booking_date: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      booking: bookings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { booking_id: id },
      relations: ['tour_packages', 'User'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }
  //Pagination Implementation.
  async findByUserId(
    user_id: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    bookings: Booking[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { booking_id: user_id },
      relations: ['tour_packages', 'User'],
      order: { booking_date: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      bookings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (updateBookingDto.status) {
      const validTransitions: Record<BookingStatus, BookingStatus[]> = {
        [BookingStatus.Pending]: [
          BookingStatus.Confirmed,
          BookingStatus.Cancelled,
        ],
        [BookingStatus.Confirmed]: [
          BookingStatus.Completed,
          BookingStatus.Cancelled,
        ],
        [BookingStatus.Cancelled]: [],
        [BookingStatus.Completed]: [],
      };

      if (
        !validTransitions[booking.status]?.includes(updateBookingDto.status)
      ) {
        throw new BadRequestException(
          `Cannot change booking status from ${booking.status} to ${updateBookingDto.status}`,
        );
      }
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async updateStatus(id: number, status: BookingStatus): Promise<Booking> {
    return await this.update(id, { status });
  }

  async remove(id: number): Promise<{ message: string }> {
    const booking = await this.findOne(id);

    if (
      ![BookingStatus.Pending, BookingStatus.Cancelled].includes(booking.status)
    ) {
      throw new BadRequestException(
        'Cannot delete a confirmed or completed booking',
      );
    }
    await this.bookingRepository.delete(id);
    return { message: 'Booking deleted successfully!' };
  }
}
