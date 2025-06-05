import { Test, TestingModule } from '@nestjs/testing';
import { TourPackagesService } from './tour_packages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TourPackage } from './entities/tour_package.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

describe('TourPackagesService', () => {
  let service: TourPackagesService;
  let repository: Repository<TourPackage>;
  let cacheManager: Cache;

  const mockTourPackage = {
    package_id: 1,
    name: 'Test Package',
    description: 'Test Description',
    price: 100,
    duration: '3 days',
    location: 'Test Location',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourPackagesService,
        {
          provide: getRepositoryToken(TourPackage),
          useValue: {
            create: jest.fn().mockReturnValue(mockTourPackage),
            save: jest.fn().mockResolvedValue(mockTourPackage),
            find: jest.fn().mockResolvedValue([mockTourPackage]),
            findOneBy: jest.fn().mockResolvedValue(mockTourPackage),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TourPackagesService>(TourPackagesService);
    repository = module.get<Repository<TourPackage>>(
      getRepositoryToken(TourPackage),
    );
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached tour packages if available', async () => {
      const cachedPackages = [mockTourPackage];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedPackages);

      const result = await service.findAll();

      expect(result).toEqual(cachedPackages);
      expect(cacheManager.get).toHaveBeenCalledWith('all_tour_packages');
      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if no cache exists', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      const result = await service.findAll();

      expect(result).toEqual([mockTourPackage]);
      expect(cacheManager.get).toHaveBeenCalledWith('all_tour_packages');
      expect(repository.find).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        'all_tour_packages',
        [mockTourPackage],
        3600000,
      );
    });
  });

  describe('findOne', () => {
    it('should return cached tour package if available', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(mockTourPackage);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTourPackage);
      expect(cacheManager.get).toHaveBeenCalledWith('tour_package_1');
      expect(repository.findOneBy).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if no cache exists', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTourPackage);
      expect(cacheManager.get).toHaveBeenCalledWith('tour_package_1');
      expect(repository.findOneBy).toHaveBeenCalledWith({ package_id: 1 });
      expect(cacheManager.set).toHaveBeenCalledWith(
        'tour_package_1',
        mockTourPackage,
        3600000,
      );
    });
  });

  describe('create', () => {
    it('should create tour package and invalidate cache', async () => {
      const createDto = {
        name: 'Test Package',
        description: 'Test Description',
        price: 100,
        duration: '3 days',
        location: 'Test Location',
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockTourPackage);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('all_tour_packages');
    });
  });

  describe('update', () => {
    it('should update tour package and invalidate cache', async () => {
      const updateDto = { name: 'Updated Package' };

      await service.update(1, updateDto);

      expect(cacheManager.del).toHaveBeenCalledWith('tour_package_1');
      expect(cacheManager.del).toHaveBeenCalledWith('all_tour_packages');
    });
  });

  describe('remove', () => {
    it('should remove tour package and invalidate cache', async () => {
      await service.remove(1);

      expect(cacheManager.del).toHaveBeenCalledWith('tour_package_1');
      expect(cacheManager.del).toHaveBeenCalledWith('all_tour_packages');
    });
  });
});
