import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { TourPackage } from '../../tour_packages/entities/tour_package.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Pending = 'pending',
  Completed = 'completed',
}
@Entity()
export class Booking {
  @ApiProperty({ description: 'Unique booking identifier' })
  @PrimaryGeneratedColumn()
  booking_id: number;

  @ApiProperty({ description: 'ID of the tour package' })
  @Column({ type: 'varchar', nullable: false })
  package_id: number;

  @ApiProperty({ description: 'Date when booking was made' })
  @Column({ type: 'date', nullable: false })
  booking_date: Date;

  @ApiProperty({
    description: 'Current status of the booking',
    enum: BookingStatus,
    default: BookingStatus.Pending,
  })
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Pending })
  status: BookingStatus;

  @ManyToOne(() => TourPackage, (pkg) => pkg.bookings)
  @JoinColumn({ name: 'package_id' })
  package: Relation<TourPackage>;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
