import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

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
