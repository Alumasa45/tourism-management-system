import { PartialType } from '@nestjs/swagger';
import { CreateGuestUserDto } from './create-guest_user.dto';

export class UpdateGuestUserDto extends PartialType(CreateGuestUserDto) {}
