// users.controller.ts

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(email, password);
  }

  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.validateUser(email, password);
      const token = await this.usersService.createToken(user);
      console.log('token', token);
      return {
        message: 'Login successful',
        user,
        token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
