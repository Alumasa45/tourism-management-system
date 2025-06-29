import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Relation,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  package_id: number;

  @Column({ type: 'varchar', length: 255 })
  package_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @Column({ type: 'int', nullable: false })
  available_slots: number;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @OneToOne(() => Booking, (bookings) => bookings.package_id)
  bookings: Relation<Booking>;
}
