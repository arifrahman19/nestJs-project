import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];


    fakeUsersService = {
      findAll: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          name,
          email,
          password
        } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create new user', async () => {
    const user = await service.register('jane doe', 'jane@example.com', 'test');
    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail to create new user if email already in use', async () => {
    await service.register('jane doe', 'jane@example.com', 'test');
    await expect(service.register('jane doe', 'jane@example.com', 'test')).rejects.toThrow('Email already in use');
  });

  it('should fail if user login with invalid email', async () => {
    await expect(service.login('jane@example.com', 'test')).rejects.toThrow('Email not registered');
  });

  it('should fail if user login with invalid password', async () => {
    await service.register('jane doe', 'jane@example.com', 'test');
    await expect(service.login('jane@example.com', 'wrong')).rejects.toThrow('Wrong password');
  })

  it('should login with valid password', async () => {
    await service.register('jane doe', 'jane@example.com', 'test');
    const user = await service.login('jane@example.com', 'test');
    expect(user).toBeDefined();
  })

});
