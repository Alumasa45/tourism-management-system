import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    User_id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    first_name: 'Test',
    last_name: 'User',
    phone_number: '1234567890',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const password = 'testPassword';
      const hashedPassword = await bcrypt.hash(password, 12);
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.validateUser('test@example.com', password);
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe(mockUser.email);
    });

    it('should return null when credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);
      expect(result.access_token).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.User_id,
        role: mockUser.role,
      });
    });
  });
});
