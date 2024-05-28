import { Body, Controller, Get, Post, Session, UseInterceptors } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from '../users/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
    constructor(private usersService: UsersService, private authService: AuthService) {}
    @Post('/register')
    async register(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.register(body.name, body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto, @Session() session: any) {
        const user = await this.authService.login(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/logout')
    logout(@Session() session: any) {
        session.userId = null;
    }

    @Get('/whoami')
    async whoAmI(@CurrentUser() user: User) {
        return user;
    }
}
