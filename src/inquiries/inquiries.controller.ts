import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Inquiry registration' })
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inquiries.' })
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one inquiry by ID' })
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'inquiry status update.' })
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiriesService.update(+id, updateInquiryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inquiry by ID' })
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(+id);
  }
}
