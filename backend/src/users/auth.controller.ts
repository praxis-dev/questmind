// auth.controller.ts (backend)

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    // Handles the Google OAuth2 callback
    const user = req.user;
    console.log(user);
    res.redirect('https://questmind.ai/users/google/callback');

    // Here, implement what to do with the user info, e.g., token creation
  }
}
