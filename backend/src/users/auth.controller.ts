import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const googleUser = req.user;
    try {
      const user = await this.usersService.createOrGetGoogleUser(
        googleUser.email,
      );

      const token = await this.usersService.createToken(user);

      res.redirect(`http://localhost:3000/landing/?token=${token}`);
      // deploycheck
    } catch (error) {
      throw new BadRequestException('Authentication failed');
    }
  }
}
