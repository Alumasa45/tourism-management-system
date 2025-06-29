import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestUser } from './entities/guest_user.entity';

@Injectable()
export class GuestUsersService {
  constructor(
    @InjectRepository(GuestUser)
    private readonly guestUserRepository: Repository<GuestUser>
  ) {}
  async create(createGuestUserDto: CreateGuestUserDto): Promise<any> {
    const guestUser = this.guestUserRepository.create(createGuestUserDto);
    return this.guestUserRepository.save(guestUser)
  }

  async login(email: string): Promise<any> {
    try {
    const guestUser = await this.findByEmail(email);
    if(!guestUser) {
      throw new NotFoundException('Guest user does not exist!')
    }

    return guestUser;
  } catch (error) {
    throw new Error('Login failed.')
  }
}

  async findByEmail(email: string): Promise<GuestUser> {
    const guestUser = await this.guestUserRepository.findOne({ where: {email: email }})
    if(!guestUser) {
      throw new NotFoundException(`Guest User with email ${email} not found!`)
    }
    return guestUser;
  }

  async findOne(guest_id: number): Promise<GuestUser> {
    const guestUser = await this.guestUserRepository.findOne({ where: {guest_id: guest_id}});
    if(!guestUser) {
      throw new NotFoundException(`Guest User with ID ${guest_id} not found!`)
    }
    return guestUser;
  }


  async findAll(): Promise<GuestUser[]> { 
    return this.guestUserRepository.find();
  }

  async updateGuestUser(guest_id: number): Promise <any> {
    const guestUser = await this.findOne(guest_id)
    if (!guestUser) {
      throw new NotFoundException(`Guest user with ID ${guest_id} not found!`);
    }
    return this.findOne
  }

  async delete(guest_id: number): Promise<any> {
    try {
      const guestUser = await this.findOne(guest_id);
      if(!guestUser) {
        throw new Error('Guest user not found!');
      }
      await this.guestUserRepository.delete({ guest_id});
      return { message: 'Guest User deleted successfully.'};
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  }
}
