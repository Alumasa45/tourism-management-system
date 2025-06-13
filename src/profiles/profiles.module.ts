import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from './entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Profile, User])],
  controllers: [ProfilesController],
  providers: [ProfilesService, RolesGuard],
  exports: [ProfilesService, TypeOrmModule],
})
export class ProfilesModule {}
