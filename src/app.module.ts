import { Module,MiddlewareConsumer,NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InquiriesModule } from './inquiries/inquiries.module';
import { TourPackagesModule } from './tour_packages/tour_packages.module';
import { DatabaseModule } from './database/database.module';
import { TicketsModule } from './tickets/tickets.module';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { AdminLogsModule } from './admin_logs/admin_logs.module';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { ProfilesModule } from './profiles/profiles.module';
import { GuestUsersModule } from './guest_users/guest_users.module';
import { LogsModule } from './logs/logs.module';
import { SeedModule } from './seed/seed.module';
import { CacheableMemory } from 'cacheable';
import { createKeyv, Keyv } from '@keyv/redis'



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env'}),
       InquiriesModule, TourPackagesModule, 
      TicketsModule, BookingsModule, UsersModule, SeedModule, AdminsModule, 
      ProfilesModule, GuestUsersModule, LogsModule, AuthModule,
      CacheModule.register({
        ttl: 60,
        max: 100,
        isGlobal: true,
      }),
    ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor,
    }
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('admins', 'bookings', 'guest_users', 'inquiries', 'profiles', 'tickets', 'tour_packages', 'users');
  }
}
