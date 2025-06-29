import { Module } from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { GuestUsersController } from './guest_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestUser } from './entities/guest_user.entity';
import { Profile } from 'src/profiles/entities/profile.entity';


@Module({
  imports: [TypeOrmModule.forFeature([GuestUser, Profile])],
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}
