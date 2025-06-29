import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { GuestUser } from './entities/guest_user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator'; // adjust path as needed
import { RolesGuard, AtGuard } from 'src/auth/guards'; // adjust path as needed
import { UserRole } from 'src/profiles/entities/profile.entity'; // adjust path as needed

@ApiTags('guest users')
@ApiBearerAuth()
@Controller('guest-users')
export class GuestUsersController {
  constructor(private readonly guestUsersService: GuestUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Guest User registration'})
  create(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.guestUsersService.create(createGuestUserDto);
  }
@Get()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 201, description: 'Creates new user', type: GuestUser })
  @ApiResponse({ status: 201, description: 'Creates new user', type: GuestUser })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions. Requires ADMIN and USER role.' })
  @ApiOperation({ summary: 'Gets all guest users'})
  findAll() {
    return this.guestUsersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets one guest user by ID'})
  findOne(@Param('id') id: string) {
    return this.guestUsersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGuestUserDto: UpdateGuestUserDto) {
  //   return this.guestUsersService.update(+id, updateGuestUserDto);
  // }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.guestUsersService.delete(+id);
  }
}
