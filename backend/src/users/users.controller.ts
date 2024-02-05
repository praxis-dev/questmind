// users.controller.ts (backend)

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,

} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteUser(@Req() req: any) {
      const requestingUser = req.user;
      console.log(requestingUser);
      
      try {
          await this.usersService.deleteUser(requestingUser._id);
          return { message: 'User deleted successfully' };
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  }  

  @Post()
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      await this.usersService.createUser(email, password);
      return this.loginUser(email, password);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error creating user');
    }
  }

  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.validateUser(email, password);
      const token = await this.usersService.createToken(user);
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
