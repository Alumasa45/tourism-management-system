import { PartialType } from '@nestjs/swagger';
import { CreateTourPackageDto } from './create-tour_package.dto';

export class UpdateTourPackageDto extends PartialType(CreateTourPackageDto) {}
