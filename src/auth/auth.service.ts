import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, UserRole } from 'src/profiles/entities/profile.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
 constructor(
  @InjectRepository(User) private userRepository: Repository<User>,
  private jwtService: JwtService,
    private configService: ConfigService,
 ) {}

  private async getTokens(userId: number, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role: UserRole,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ), 
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role: UserRole,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

 private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return await Bcrypt.hash(data, salt);
  }

 private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async signUp(createAuthDto: CreateAuthDto) { 
    const foundUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
      select: ['User_id', 'email', 'password', 'role'], 
    });
    if (!foundUser) {
      throw new NotFoundException(
        `User with email ${createAuthDto.email} not found`,
      );
    }
   
    const foundPassword = await Bcrypt.compare(
      createAuthDto.password,
      foundUser.password,
    );
    console.log(foundUser);
    if (!foundPassword) {
      throw new NotFoundException('Invalid credentials');
    }
    
    const { accessToken, refreshToken } = await this.getTokens(
      Number(foundUser.User_id), 
      foundUser.email,
      foundUser.role,
    );

    await this.saveRefreshToken(Number(foundUser.User_id), refreshToken);
    return { accessToken, refreshToken };
  }

  async signOut(id:number) {
     const res = await this.userRepository.update(id, {
      hashedRefreshToken: String,
    });

    if (res.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with id : ${id} signed out successfully` };
  }

   async refreshTokens(id: number, refreshToken: string) { 
     const foundUser = await this.userRepository.findOne({
      where: { User_id: id },
      select: ['User_id', 'email', 'role',]
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!foundUser.hashedRefreshToken) {
      throw new NotFoundException('No refresh token found');
    }

    const refreshTokenMatches = await Bcrypt.compare(
      refreshToken,
      foundUser.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new NotFoundException('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      Number(foundUser.User_id),
      foundUser.email,
      foundUser.role,
    );

    await this.saveRefreshToken(Number(foundUser.User_id), newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
   




