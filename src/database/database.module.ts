import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const logger = new Logger('DatabaseModule');

        try {
          const config: TypeOrmModuleOptions = {
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5433),
            username: configService.get<string>('DB_USERNAME', 'postgres'),
            password: configService.get<string>('DB_PASSWORD', 'aquinattaayo'),
            database: configService.get<string>(
              'DB_DATABASE',
              'tourism_management',
            ),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get<boolean>('DB_SYNC', true),
            logging: configService.get<boolean>('DB_LOGGING', true),
          };
          logger.log('Successfully loaded database config');
          return config;
        } catch (error) {
          logger.error(
            'Failed to load database config or connect to the database',
            error,
          );
          throw error;
        }
      },
    }),
  ],
})
export class DatabaseModule {}
