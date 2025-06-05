import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAdminLogDto } from './create-admin_log.dto';

export class UpdateAdminLogDto extends PartialType(CreateAdminLogDto) {}
