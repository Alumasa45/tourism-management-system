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

export enum BookingStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Pending = 'pending',
  Completed = 'completed',
}
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column({ type: 'varchar', nullable: false })
  package_id: number;

  @Column({ type: 'date', nullable: false })
  booking_date: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Pending })
  status: BookingStatus;

  @ManyToOne(() => TourPackage, (pkg) => pkg.bookings)
  @JoinColumn({ name: 'package_id' })
  package: Relation<TourPackage>;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
