import { ApiProperty } from '@nestjs/swagger';

export class CreateTourPackageDto {
  @ApiProperty({
    description: 'The name of the tour package',
    example: 'Paris City Tour',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the tour package',
    example:
      'A comprehensive 3-day tour of Paris including Eiffel Tower and Louvre Museum',
  })
  description: string;

  @ApiProperty({
    description: 'The price of the tour package',
    example: 299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Duration of the tour in days',
    example: 3,
  })
  duration: number;

  @ApiProperty({
    description: 'Maximum number of participants',
    example: 20,
  })
  maxParticipants: number;

  @ApiProperty({
    description: 'Location of the tour',
    example: 'Paris, France',
  })
  location: string;

  @ApiProperty({
    description: 'Start date of the tour',
    example: '2024-06-15',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the tour',
    example: '2024-06-18',
  })
  endDate: Date;
}
