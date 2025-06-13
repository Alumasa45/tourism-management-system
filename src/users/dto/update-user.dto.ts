import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { status } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Override status to accept both string and enum
  status?: status;
}
