import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

import { Booking } from '../../bookings/entities/booking.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum status {
  Active = 'Active',
  InActive = 'Inactive',
}
@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  User_id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  first_name: string;

  @Column({ type: 'varchar', nullable: false })
  last_name: string;

  @Column({ type: 'enum', enum: status, default: status.Active })
  status: status;

  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  @Column({ type: 'date', default: new Date() })
  last_login: string;

  @OneToMany(() => Booking, (booking: Booking) => booking.user)
  bookings: Relation<Booking[]>;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.user)
  tickets: Relation<Ticket[]>;

  @ManyToOne(() => User, (user: User) => user.bookings)
  user: Relation<User>;

  @JoinColumn({ name: 'user_id' })
  user_id: Relation<User>;
}

// export class User {
//     user_id: number;
//     email: string;
//     password: string;
//     first_name: string;
//     last_name: string;
//     status: string;
//     phone_number: string;
//     last_login?: string;
// }
