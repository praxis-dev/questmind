import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private usersService: UsersService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    this.logger.log('Initiating Google OAuth');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    this.logger.log('Received Google OAuth callback');

    const googleUser = req.user;
    this.logger.debug(`Google user info: ${JSON.stringify(googleUser)}`);

    try {
      const user = await this.usersService.createOrGetGoogleUser(
        googleUser.email,
      );
      this.logger.debug(`User from DB: ${JSON.stringify(user)}`);

      const token = await this.usersService.createToken(user);
      this.logger.debug(`Generated token: ${token}`);

      res.redirect(`http://localhost:3000/landing/?token=${token}`);
      // deploycheck
    } catch (error) {
      this.logger.error('Error in Google OAuth callback', error.stack);
      throw new BadRequestException('Authentication failed');
    }
  }
}
