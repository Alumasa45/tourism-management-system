import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { CreateInquiryDto } from 'src/inquiries/dto/create-inquiry.dto';
import { JwtService } from '@nestjs/jwt';
import { User, status } from './entities/user.entity';

export interface tourist {
  User_id?: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  status: status;
  phone_number: string;
  last_login?: Date;
  user_id?: number;
}

export interface booking {
  booking_id: number;
  user_id: number;
  package_id: number;
  booking_date: Date;
  status: 'confirmed' | 'cancelled';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // User registration.
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hashing password process.
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      // Saving new user to the database.
      const savedUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
        status: status.Active,
        last_login: new Date().toISOString().split('T')[0], // Convert Date to string format.
      });

      // Generation of the JWT token.
      const payload = { sub: savedUser.User_id, email: savedUser.email };
      const token = this.jwtService.sign(payload);

      // Remove password before returning user object.
      const { password, ...userWithoutPassword } = savedUser;
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // User login.
  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('User not found, please register first.');
      }

      // Check whether password provided is valid.
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password!');
      }
      // Return user object if password is valid.
      return user;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Book a Tour.
  async Booking(
    user_id: number,
    createBookingDto: CreateBookingDto,
  ): Promise<any> {
    try {
      const user = await this.findOne(user_id);
      if (user.status !== status.Active) {
        throw new UnauthorizedException(
          'User account is inactive! Please re-register. ',
        );
      }

      const Booking = {
        booking_id: createBookingDto.booking_id,
        user_id: user_id,
        package_id: createBookingDto.package_id,
        booking_date: createBookingDto.booking_date,
        status: createBookingDto.status,
      };

      const mockBookingId = Math.floor(Math.random() * 10000);

      return {
        booking_id: mockBookingId,
        message: 'Tour booked successfully',
      };
    } catch (error) {
      throw new NotFoundException(`Could not create booking: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { User_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(id: number): Promise<User[]> {
    return this.userRepository.find({ where: { User_id: id } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Create a clean update object
    const updateData: any = { ...updateUserDto };

    // Convert string status to enum if it exists in the DTO
    if (updateData.status === 'active') {
      updateData.status = status.Active;
    } else if (updateData.status === 'inactive') {
      updateData.status = status.InActive;
    }

    await this.userRepository.update({ User_id: id }, updateData);
    return this.findOne(id);
  }
  //Generation of tickets for issues.
  async generateTicket(
    user_id: number,
    createTicketDto: CreateTicketDto,
  ): Promise<{ ticket_id: number; message: string }> {
    try {
      const user = await this.findOne(user_id);
      if (user.status !== status.Active) {
        throw new UnauthorizedException(
          'User account is inactive! Please re-register. ',
        );
      }

      // Only use the properties that are actually defined in CreateTicketDto
      const ticket = {
        booking_id: createTicketDto.booking_id,
        issue_description: createTicketDto.issue_description,
      };

      const mockTicketId = Math.floor(Math.random() * 10000);

      return {
        ticket_id: mockTicketId,
        message: 'Support ticket created successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new Error(`Could not create ticket: ${error.message}`);
    }
  }

  async getUserTickets(userId: number): Promise<any[]> {
    try {
      // Verify user exists.
      await this.findOne(userId);

      // return await this.ticketRepository.find({ where: { user_id: userId } });

      // Mock response.
      return [
        {
          ticket_id: 1,
          issue_description: 'Having trouble with my booking',
          ticket_status: 'open',
          created_at: new Date(),
          resolved_at: Date(),
        },
      ];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Could not create ticket: ${error.message}`);
    }
  }

  // Get user profile with statistics.
  async getUserProfileWithStats(userId: number): Promise<any> {
    try {
      const user = await this.findOne(userId);

      // Get booking and ticket counts.
      // await this.bookingRepository.count({ where: { user_id: userId } });
      // await this.ticketRepository.count({ where: { user_id: userId } });
      const bookingCount = 0;
      const ticketCount = 0;
      return {
        ...user,
        stats: {
          total_bookings: bookingCount,
          total_tickets: ticketCount,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to get user profile with stats: ${error.message}`,
      );
    }
  }
  //Make inquiry.
  async makeInquiry(
    user_id: number,
    createInquiryDto: CreateInquiryDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.findOne(user_id);
      if (!user) {
        throw new UnauthorizedException('User not found!');
      }

      const inquiry = {
        inquiry_id: createInquiryDto.inquiry_id,
        guest_id: createInquiryDto.guest_id,
        user_id: createInquiryDto.user_id,
        inquiry_type: createInquiryDto.inquiry_type,
        message: createInquiryDto.message,
        status: createInquiryDto.status,
        created_at: createInquiryDto.created_at,
      };

      const mockInquiryId = Math.floor(Math.random() * 10000);
      const message = `Inquiry ${mockInquiryId} has been created successfully!`;
      return {
        message: message,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new Error(`Failed to create inquiry: ${error.message}`);
    }
  }

  // Helper methods
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  //Update a user.
  async update(user_id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const user = await this.findOne(user_id);
      if (!user) {
        throw new Error('User not found!');
      }

      const updateData: any = { ...updateUserDto };

      // Convert string status to enum
      if (typeof updateData.status === 'string') {
        if (updateData.status.toLowerCase() === 'active') {
          updateData.status = status.Active;
        } else if (updateData.status.toLowerCase() === 'inactive') {
          updateData.status = status.InActive;
        }
      }

      // Update user in the repository
      await this.userRepository.update({ User_id: user_id }, updateData);
      const updatedUser = await this.findOne(user_id);
      return updatedUser;
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  //Delete a user.
  async delete(user_id: number): Promise<any> {
    try {
      const user = await this.findOne(user_id);
      if (!user) {
        throw new Error('User not found!');
      }
      // Delete user from the repository.
      await this.userRepository.delete({ User_id: user_id });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
  private async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(
      { User_id: userId },
      { last_login: new Date().toISOString().split('T')[0] },
    );
  }
}
