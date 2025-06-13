import { IsNumber, IsString } from 'class-validator';
import { ticket_status } from '../entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({description: 'Issue description, e.g, Cannot create ticket.'})
  @IsString()
  issue_description: string;

  @ApiProperty({ description: 'booking id.'})
  @IsNumber()
  booking_id: number;
}
