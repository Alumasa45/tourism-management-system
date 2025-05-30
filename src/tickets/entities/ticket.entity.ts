import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ticket_status {
  Open = 'Open',
  Closed = 'Closed',
  Resolved = 'Resolved',
}
@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  ticket_id: number;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  issue_description: string;

  @Column({ type: 'enum', enum: ticket_status, default: ticket_status.Open })
  ticket_status: ticket_status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  resolved_at: Date;

  @OneToMany(() => User, (user: User) => user.tickets)
  users: Relation<User[]>;
  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
