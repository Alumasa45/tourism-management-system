import { ticket_status } from '../entities/ticket.entity';

export class CreateTicketDto {
  issue_description: string;
  booking_id: number;
}
