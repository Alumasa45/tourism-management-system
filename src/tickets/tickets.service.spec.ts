import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket, ticket_status } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';

describe('TicketsService', () => {
  let service: TicketsService;
  let repository: Repository<Ticket>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    repository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a ticket by id', async () => {
      const mockTicket = {
        ticket_id: 1,
        issue_description: 'Test issue',
        ticket_status: ticket_status.Open,
        created_at: new Date(),
        resolved_at: null,
        users: [],
        user: null,
        booking_id: 1
      };

      mockRepository.findOne.mockResolvedValue(mockTicket);

      const result = await service.findOne(1);
      expect(result).toEqual(mockTicket);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { ticket_id: 1 },
      });
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        booking_id: 1,
        issue_description: 'Test issue',
      };

      const mockTicket = {
        ticket_id: 1,
        issue_description: createTicketDto.issue_description,
        ticket_status: ticket_status.Open,
        created_at: expect.any(Date),
        resolved_at: null,
        users: [],
        user: null,
        booking_id: createTicketDto.booking_id
      };

      mockRepository.create.mockReturnValue(mockTicket);
      mockRepository.save.mockResolvedValue(mockTicket);

      const result = await service.create(createTicketDto);

      expect(result).toEqual({
        ticket_id: mockTicket.ticket_id,
        message: 'Ticket generated successfully',
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        issue_description: createTicketDto.issue_description,
        ticket_status: ticket_status.Open,
        created_at: expect.any(Date),
        resolved_at: null,
        booking_id: createTicketDto.booking_id
      });
    });

    it('should throw NotFoundException when booking_id is not provided', async () => {
      const createTicketDto: CreateTicketDto = {
        booking_id: 1,
        issue_description: 'Test issue',
      };

      await expect(service.create(createTicketDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
