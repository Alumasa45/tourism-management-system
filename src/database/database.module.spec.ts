import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('DatabaseModule', () => {
  it('should be defined', async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should load database configuration successfully', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get('DB_SYNC', true),
            logging: configService.get('DB_LOGGING', false),
          }),
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    await expect(app.init()).resolves.not.toThrow();
    await app.close();
  });
});
