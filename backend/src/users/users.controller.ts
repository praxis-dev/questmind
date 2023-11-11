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
      // Here you should generate a token (JWT or similar) based on user information
      return {
        message: 'Login successful',
        user,
        // token: 'generated-token-here', // Implement token generation
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
