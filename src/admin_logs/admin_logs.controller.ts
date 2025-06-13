import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminLogsService } from './admin_logs.service';
import { CreateAdminLogDto } from './dto/create-admin_log.dto';
import { UpdateAdminLogDto } from './dto/update-admin_log.dto';

@Controller('admin-logs')
export class AdminLogsController {
  constructor(private readonly adminLogsService: AdminLogsService) {}

  @Post()
  create(@Body() createAdminLogDto: CreateAdminLogDto) {
    return this.adminLogsService.create(createAdminLogDto);
  }

  @Get()
  findAll() {
    return this.adminLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminLogDto: UpdateAdminLogDto,
  ) {
    return this.adminLogsService.update(+id, updateAdminLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminLogsService.remove(+id);
  }
}
