import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, UserRole } from './entities/profile.entity';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(AtGuard, RolesGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.findOne(id);
  }

   @Roles(UserRole.ADMIN, UserRole.USER, UserRole.GUEST)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesService.create(createProfileDto);
  }

   @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateProfileDto);
  }

   @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.profilesService.remove(id);
  }
}
