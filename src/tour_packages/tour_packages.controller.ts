import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TourPackagesService } from './tour_packages.service';
import { CreateTourPackageDto } from './dto/create-tour_package.dto';
import { UpdateTourPackageDto } from './dto/update-tour_package.dto';

@ApiTags('Tour Packages')
@Controller('tour-packages')
export class TourPackagesController {
  constructor(private readonly tourPackagesService: TourPackagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tour package' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The tour package has been successfully created.',
    type: CreateTourPackageDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createTourPackageDto: CreateTourPackageDto) {
    return this.tourPackagesService.create(createTourPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tour packages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all tour packages',
    type: [CreateTourPackageDto],
  })
  findAll() {
    return this.tourPackagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tour package by id' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the tour package',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the tour package',
    type: CreateTourPackageDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tour package not found',
  })
  findOne(@Param('id') id: string) {
    return this.tourPackagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tour package' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the tour package to update',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The tour package has been successfully updated.',
    type: CreateTourPackageDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tour package not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateTourPackageDto: UpdateTourPackageDto,
  ) {
    return this.tourPackagesService.update(+id, updateTourPackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tour package' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the tour package to delete',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The tour package has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tour package not found',
  })
  remove(@Param('id') id: string) {
    return this.tourPackagesService.remove(+id);
  }
}
