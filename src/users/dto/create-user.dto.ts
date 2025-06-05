import { status } from '../entities/user.entity';

export class CreateUserDto {
  User_id?: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  status: status;
  phone_number: string;
  last_login?: Date;
}
