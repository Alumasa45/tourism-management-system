import { Module } from '@nestjs/common';
import { TourPackagesService } from './tour_packages.service';
import { TourPackagesController } from './tour_packages.controller';

@Module({
  controllers: [TourPackagesController],
  providers: [TourPackagesService],
})
export class TourPackagesModule {}
