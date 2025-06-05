import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourPackageDto } from './dto/create-tour_package.dto';
import { UpdateTourPackageDto } from './dto/update-tour_package.dto';
import { TourPackage } from './entities/tour_package.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class TourPackagesService {
  constructor(
    @InjectRepository(TourPackage)
    private readonly tourPackageRepository: Repository<TourPackage>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createTourPackageDto: CreateTourPackageDto) {
    try {
      const tourPackage: TourPackage =
        this.tourPackageRepository.create(createTourPackageDto);
      const savedPackage = await this.tourPackageRepository.save(tourPackage);
      // Invalidate the cache for tour packages list
      await this.cacheManager.del('all_tour_packages');
      return savedPackage;
    } catch (error) {
      throw new BadRequestException('Failed to create tour package.');
    }
  }

  async findAll() {
    // Try to get from cache first.
    const cachedPackages =
      await this.cacheManager.get<TourPackage[]>('all_tour_packages');
    if (cachedPackages) {
      return cachedPackages;
    }

    // If not in cache, get from database
    const packages = await this.tourPackageRepository.find();
    //stored in cache .
    await this.cacheManager.set('all_tour_packages', packages, 3600000);
    return packages;
  }

  async findOne(id: number): Promise<TourPackage> {
    // Try to get from cache first
    const cacheKey = `tour_package_${id}`;
    const cachedPackage = await this.cacheManager.get<TourPackage>(cacheKey);
    if (cachedPackage) {
      return cachedPackage;
    }

    const tourPackage = await this.tourPackageRepository.findOneBy({
      package_id: id,
    });
    if (!tourPackage) {
      throw new NotFoundException('TourPackage not found');
    }
    // Store in cache for 1 hour
    await this.cacheManager.set(cacheKey, tourPackage, 3600000);
    return tourPackage;
  }

  async update(id: number, updateTourPackageDto: UpdateTourPackageDto) {
    const tourPackage = await this.findOne(id);
    if (!tourPackage) {
      throw new NotFoundException('TourPackage not found');
    }
    Object.assign(tourPackage, updateTourPackageDto);
    const updatedPackage = await this.tourPackageRepository.save(tourPackage);
    // Invalidate both the specific package cache and the all packages cache
    await this.cacheManager.del(`tour_package_${id}`);
    await this.cacheManager.del('all_tour_packages');
    return updatedPackage;
  }

  async remove(id: number) {
    const tourPackage = await this.findOne(id);
    if (!tourPackage) {
      throw new NotFoundException('TourPackage not found');
    }
    await this.tourPackageRepository.remove(tourPackage);

    await this.cacheManager.del(`tour_package_${id}`);
    await this.cacheManager.del('all_tour_packages');
    return { message: 'TourPackage removed successfully' };
  }
}
