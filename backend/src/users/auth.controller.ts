// auth.controller.ts (backend)

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('Initiating Google OAuth');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    console.log('Google OAuth callback received');

    const user = req.user;
    console.log(user);
    res.redirect('http://localhost:3000');
    // Here, implement what to do with the user info, e.g., token creation
  }
}
