export class CreateTicketDto {
  ticket_id: number;
  user_id: number;
  booking_id: number;
  issue_description: string;
  ticket_status: 'open' | 'closed' | 'resolved';
  created_at: Date;
  resolved_at: Date;
}
