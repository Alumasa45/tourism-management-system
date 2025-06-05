import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InquiriesModule } from './inquiries/inquiries.module';
import { TourPackagesModule } from './tour_packages/tour_packages.module';
import { DatabaseModule } from './database/database.module';
import { TicketsModule } from './tickets/tickets.module';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { AdminLogsModule } from './admin_logs/admin_logs.module';
import { ConfigService } from '@nestjs/config';
//import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        //store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        ttl: configService.get('CACHE_TTL', 60 * 60),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    BookingsModule,
    TicketsModule,
    DatabaseModule,
    TourPackagesModule,
    InquiriesModule,
    SeedModule,
    AdminsModule,
    AdminLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
