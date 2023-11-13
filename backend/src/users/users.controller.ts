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

  @Post('reset-password-request')
  async resetPasswordRequest(@Body('email') email: string) {
    try {
      await this.usersService.generatePasswordResetToken(email);
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.usersService.resetPassword(token, newPassword);
      return { message: 'Password reset successful' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
