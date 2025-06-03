import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: Repository<Booking>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking with confirmed status', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_id: 1,
        user_id: 1,
        package_id: 1,
        booking_date: new Date('2024-01-01'),
        status: BookingStatus.Confirmed,
      };

      const expectedBooking = {
        ...createBookingDto,
        status: BookingStatus.Confirmed,
      };

      mockRepository.create.mockReturnValue(expectedBooking);
      mockRepository.save.mockResolvedValue(expectedBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual(expectedBooking);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createBookingDto,
        booking_date: expect.any(Date),
        status: BookingStatus.Confirmed,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedBooking);
    });

    it('should create a booking with cancelled status', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_id: 1,
        user_id: 1,
        package_id: 1,
        booking_date: new Date('2024-01-01'),
        status: BookingStatus.Cancelled,
      };

      const expectedBooking = {
        ...createBookingDto,
        status: BookingStatus.Cancelled,
      };

      mockRepository.create.mockReturnValue(expectedBooking);
      mockRepository.save.mockResolvedValue(expectedBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual(expectedBooking);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createBookingDto,
        booking_date: expect.any(Date),
        status: BookingStatus.Cancelled,
      });
    });

    it('should create a booking with pending status when no status provided', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_id: 1,
        user_id: 1,
        package_id: 1,
        booking_date: new Date('2024-01-01'),
      };

      const expectedBooking = {
        ...createBookingDto,
        status: BookingStatus.Pending,
      };

      mockRepository.create.mockReturnValue(expectedBooking);
      mockRepository.save.mockResolvedValue(expectedBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual(expectedBooking);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createBookingDto,
        booking_date: expect.any(Date),
        status: BookingStatus.Pending,
      });
    });

    it('should throw BadRequestException when save fails', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_id: 1,
        user_id: 1,
        package_id: 1,
        booking_date: new Date('2024-01-01'),
      };

      mockRepository.create.mockReturnValue({
        ...createBookingDto,
        status: BookingStatus.Pending,
      });
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should allow valid status transition from pending to confirmed', async () => {
      const booking = {
        booking_id: 1,
        status: BookingStatus.Pending,
      };

      const updateDto = {
        status: BookingStatus.Confirmed,
      };

      mockRepository.findOne.mockResolvedValue(booking);
      mockRepository.save.mockResolvedValue({ ...booking, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result.status).toBe(BookingStatus.Confirmed);
    });

    it('should allow valid status transition from confirmed to cancelled', async () => {
      const booking = {
        booking_id: 1,
        status: BookingStatus.Confirmed,
      };

      const updateDto = {
        status: BookingStatus.Cancelled,
      };

      mockRepository.findOne.mockResolvedValue(booking);
      mockRepository.save.mockResolvedValue({ ...booking, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result.status).toBe(BookingStatus.Cancelled);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const booking = {
        booking_id: 1,
        status: BookingStatus.Cancelled,
      };

      const updateDto = {
        status: BookingStatus.Confirmed,
      };

      mockRepository.findOne.mockResolvedValue(booking);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow update without status change', async () => {
      const booking = {
        booking_id: 1,
        status: BookingStatus.Confirmed,
        package_id: 1,
      };

      const updateDto = {
        package_id: 2,
      };

      mockRepository.findOne.mockResolvedValue(booking);
      mockRepository.save.mockResolvedValue({ ...booking, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result.package_id).toBe(2);
      expect(result.status).toBe(BookingStatus.Confirmed);
    });
  });
});
