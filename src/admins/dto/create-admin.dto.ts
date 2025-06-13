import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateAdminDto {
@ApiProperty({ description: 'Unique admin identifier.'})
@IsNumber()
@IsNotEmpty()
admin_id: number;

@ApiProperty({ description: 'Admins username'})
@IsString()
@IsNotEmpty()
username: string;

@ApiProperty({description: 'Admin password.'})
@IsString()
@IsNotEmpty()
password: string;

@ApiProperty({ description: 'Admins email.'})
@IsString()
@IsNotEmpty()
email: string;

@ApiProperty({description: 'last login date.'})
@IsDate()
last_login: Date;
}
