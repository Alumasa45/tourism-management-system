import { PartialType } from '@nestjs/mapped-types';
import { CreateTourPackageDto } from './create-tour_package.dto';

export class UpdateTourPackageDto extends PartialType(CreateTourPackageDto) {}
