import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('insert-user')
  async insertUser() {
    return this.userService.insertUser();
  }

  @Get('get-users')
  async getUsers() {
    return this.userService.getUsers();
  }
}
