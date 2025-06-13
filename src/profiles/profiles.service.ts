import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/entities/user.entity';


@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .getMany();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.id = :id', { id })
      .getOne();

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const { first_name, last_name, email, password, role, userId } =
      createProfileDto;
    const user = await this.UserRepository.findOne({
      where: { User_id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const profile = this.profilesRepository.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      role: role,
    });

    profile.user = user;

    await this.profilesRepository.save(profile);
    return this.findOne(profile.id);
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(id);

    // Prepare update object
    const updateData: any = { ...updateProfileDto };

    // Remove userId from direct update as we need to handle the relation separately
    delete updateData.userId;

    await this.profilesRepository
      .createQueryBuilder()
      .update(Profile)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    // Update the relation if userId is provided
    if (updateProfileDto.userId) {
      await this.profilesRepository
        .createQueryBuilder()
        .relation(Profile, 'user')
        .of(id)
        .set(updateProfileDto.userId);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profilesRepository
      .createQueryBuilder()
      .delete()
      .from(Profile)
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }
}
