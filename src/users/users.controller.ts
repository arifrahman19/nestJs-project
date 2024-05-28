import { Body, Controller, Get, Post, Param, Query, Delete, Patch, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    createUser(@Body() body:CreateUserDto) {
        return this.usersService.create(body.name, body.email, body.password);
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.findAll(email);
    }

    @Get('/:id')
    findUserById(@Param('id') id: string) {
        return this.usersService.find(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }
}
