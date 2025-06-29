import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse  } from '@nestjs/swagger';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { User } from './entities/user.entity';
import { Roles } from 'src/auth/decorators';
import { UserRole } from 'src/profiles/entities/profile.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AtGuard, RolesGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post('registration')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Creates new user', type: User})
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions. Requires ADMIN and USER role.' })
 
  
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get users by ID' })
  findAll(@Param('id') id: string) {
    return this.usersService.findAll(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
