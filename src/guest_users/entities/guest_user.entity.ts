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
import { Profile } from 'src/profiles/entities/profile.entity';
import { Inquiry } from 'src/inquiries/entities/inquiry.entity';

@Entity('guest_users')
export class GuestUser {
  @ApiProperty({ description: 'Unique user identifier' })
  @PrimaryGeneratedColumn({ type: 'int' })
  guest_id: number;

  @ApiProperty({ description: 'guest user email address' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @ApiProperty({ description: 'guest user first name' })
  @Column({ type: 'varchar', nullable: false })
  first_name: string;

  @ApiProperty({ description: 'guest user last name' })
  @Column({ type: 'varchar', nullable: false })
  last_name: string;

  @ApiProperty({ description: 'guest user phone number' })
  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  @OneToOne(() => Profile, (profile: Profile) => profile.guestUser)
  profile: Relation<Profile>;

  @OneToMany(() => Inquiry, (inquiry: Inquiry) => inquiry.guestUser)
  inquiries: Relation<Inquiry[]>;
}
