import { Controller, HttpCode, HttpStatus, Post, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  seed() {
    this.logger.log('Seeding database...');
    return this.seedService.seed();
  }
}
