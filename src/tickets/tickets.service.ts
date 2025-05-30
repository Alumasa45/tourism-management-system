import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { CreateUserDto } from './dto/create-user.dto';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import { Ticket, ticket_status } from './entities/ticket.entity';

export interface ticket {
    ticket_id: number;
  user_id?: number;
  booking_id?: number;
  issue_description: string;
  ticket_status: 'open' | 'closed' | 'resolved';
  created_at: Date;
  resolved_at: Date;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
  private readonly ticketRepository: Repository<ticket>,
  ) {}

  //Creation of tickets.
  async create(createTicketDto: CreateTicketDto): Promise<any> {
    try {
      const existingBooking = await this.findById(CreateBookingDto.booking_id);
      if (!existingBooking) {
        throw new NotFoundException('Booking not found, please generate a booking first.'),
      }

      const Ticket = {
        ticket_id: createTicketDto.ticket_id,
        user_id: createTicketDto.user_id,
        booking_id: createTicketDto.booking_id,
        issue_description: createTicketDto.issue_description,
        ticket_status: createTicketDto.ticket_status,
        created_at: createTicketDto.created_at,
        resolved_at: createTicketDto.resolved_at,
      };

      const mockTicketId = Math.floor(Math.random() * 10000);

      return {
        ticket_id: mockTicketId,
        message: 'Generating ticket...'
    };
  } catch (error) {
    throw new NotFoundException(`Could not generate ticket: ${error.message}`);
  }
  }
  // async findAll(
  //   ): Promise<any> {
  //   try {
  //     const tickets = await this.ticketRepository.find();
  //     return tickets;
  //   } catch (error) {
  //     throw new NotFoundException(`Could not find tickets: ${error.message}`);
  //   }
  // }
  

//   findOne(id: number) {
//     return `This action returns a #${id} ticket`;
//   }

//   update(id: number, updateTicketDto: UpdateTicketDto) {
//     return `This action updates a #${id} ticket`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} ticket`;
//   }
// }
