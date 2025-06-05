import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourPackagesService } from './tour_packages.service';
import { TourPackagesController } from './tour_packages.controller';
import { TourPackage } from './entities/tour_package.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([TourPackage]),
    CacheModule.register()
  ],
  controllers: [TourPackagesController],
  providers: [TourPackagesService],
})
export class TourPackagesModule {}
