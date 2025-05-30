export class CreateUserDto {
  user_id?: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive';
  phone_number: string;
  last_login?: Date;
}
