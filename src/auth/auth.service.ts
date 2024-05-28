import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from '../users/users.service';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(name: string, email: string, password: string) {
    // check apakah user menggunakan email yang sama
    const users = await this.usersService.findAll(email);
    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    // hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const passwordHashing = salt + '.' + hash.toString('hex');

    // create user
    const user = await this.usersService.create(name, email, passwordHashing);

    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.findAll(email);
    if (!user) {
      throw new NotFoundException('Email not registered');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}
