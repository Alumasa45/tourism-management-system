import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../../bookings/entities/booking.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum status {
  Active = 'Active',
  InActive = 'Inactive',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUIDE = 'guide',
}

@Entity('Users')
export class User {
  @ApiProperty({ description: 'Unique user identifier' })
  @PrimaryGeneratedColumn({ type: 'int' })
  User_id: number;

  @ApiProperty({ description: 'User email address' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @ApiProperty({ description: 'User password (hashed)', writeOnly: true })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty({ description: 'User first name' })
  @Column({ type: 'varchar', nullable: false })
  first_name: string;

  @ApiProperty({ description: 'User last name' })
  @Column({ type: 'varchar', nullable: false })
  last_name: string;

  @ApiProperty({ 
    description: 'User account status',
    enum: status,
    default: status.Active
  })
  @Column({ type: 'enum', enum: status, default: status.Active })
  status: status;

  @ApiProperty({ 
    description: 'User role in the system',
    enum: UserRole,
    default: UserRole.USER
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: 'User phone number' })
  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  @ApiProperty({ description: 'Last login date' })
  @Column({ type: 'date', default: new Date() })
  last_login: string;

  @OneToMany(() => Booking, (booking: Booking) => booking.user)
  bookings: Relation<Booking[]>;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.user)
  tickets: Relation<Ticket[]>;

  @ManyToOne(() => User, (user: User) => user.bookings)
  parent: Relation<User>;

  @JoinColumn({ name: 'User_id' })
  parent_id: number;
}
