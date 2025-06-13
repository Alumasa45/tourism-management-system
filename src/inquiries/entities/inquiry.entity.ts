import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';

export enum status {
    OPEN = 'open',
    CLOSED = 'closed',
    RESOLVED = 'resolved',
}

@Entity('Inquiries')
export class Inquiry {
  @ApiProperty({ description: 'Unique inquiry identifier' })
  @PrimaryGeneratedColumn({ type: 'int' })
  inquiry_id?: number;

  @ApiProperty({ description: 'FK' })
  @Column({ type: 'int', nullable: false })
  guest_id?: number;

  @ApiProperty({ description: 'FK' })
  @Column({ type: 'int', nullable: false })
  user_id?: number;

  @ApiProperty({ description: 'type of inquiry' })
  @Column({ type: 'varchar', nullable: true })
  inquiry_type: string;

  @ApiProperty({ description: 'inquiry' })
  @Column({ type: 'varchar', nullable: true })
  message: string;

  @Column({ type: 'enum', enum: status, default: status.OPEN })
  status: status;

  @ApiProperty({ description: 'created at' })
  @Column({ type: 'timestamp', default: new Date(), nullable: true })
  created_at?: Date;

  //@ManyToOne(() => Inquiry, (inquiry: Inquiry) => inquiry.user_id)

  //inquiry: Relation<User>;
  @ManyToOne(() => User, (user: User) => user.inquiries)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;


}
