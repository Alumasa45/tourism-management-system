import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { ApiProperty } from '@nestjs/swagger';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity('profiles')
export class Profile {
  @ApiProperty({ description: 'unique profile id' })
  @PrimaryGeneratedColumn({type: 'int'})
  id: string;

  @Column('text')
  first_name: string;

  @Column('text', { nullable: false })
  last_name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: String;

  @Column({ nullable: true, enum: UserRole, default: UserRole.GUEST })
  role: string;

  @Column({ type: 'text', nullable: true, default: null})
  hashedRefreshToken: string|null; 

  @OneToOne(() => User, (user) => user.profile)
  user: Relation<User>;

  @OneToOne(() => GuestUser, (guestUser: GuestUser) => guestUser.profile)
  guestUser: Relation<GuestUser>;
  // @OneToOne(() => Admin, (admin) => admin.profile)
  // admin: Relation<Admin>;
}
