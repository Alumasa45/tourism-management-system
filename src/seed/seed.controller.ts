import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Called seeding endpoint')
  }
}     