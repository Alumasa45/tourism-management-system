import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import { Ticket, ticket_status } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  // Get all tickets
  async findAll(): Promise<Ticket[]> {
    try {
      return await this.ticketRepository.find();
    } catch (error) {
      throw new NotFoundException(`Error finding tickets: ${error.message}`);
    }
  }

  // Get one ticket
  async findOne(id: number): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { ticket_id: id },
      });
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }
      return ticket;
    } catch (error) {
      throw new NotFoundException(`Error finding ticket: ${error.message}`);
    }
  }

  // Creation of tickets
  async create(
    createTicketDto: CreateTicketDto,
  ): Promise<{ ticket_id: number; message: string }> {
    try {
      if (!createTicketDto.booking_id) {
        throw new NotFoundException('Booking ID is required');
      }

      // Verify if the booking exists (this would typically call a booking service)
      // For now we'll just check if booking_id is provided
      const newTicket = this.ticketRepository.create({
        issue_description: createTicketDto.issue_description,
        ticket_status: ticket_status.Open,
        created_at: new Date(),
        resolved_at: null,
        booking_id: createTicketDto.booking_id,
      });

      const savedTicket = await this.ticketRepository.save(newTicket);
      return {
        ticket_id: savedTicket.ticket_id,
        message: 'Ticket generated successfully',
      };
    } catch (error) {
      throw new NotFoundException(
        `Could not generate ticket: ${error.message}`,
      );
    }
  }

  // Update a ticket
  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    try {
      const ticket = await this.findOne(id);
      const updatedTicket = Object.assign(ticket, updateTicketDto);
      return await this.ticketRepository.save(updatedTicket);
    } catch (error) {
      throw new NotFoundException(`Error updating ticket: ${error.message}`);
    }
  }

  // Remove a ticket
  async remove(id: number): Promise<void> {
    try {
      const ticket = await this.findOne(id);
      await this.ticketRepository.remove(ticket);
    } catch (error) {
      throw new NotFoundException(`Error removing ticket: ${error.message}`);
    }
  }
}
