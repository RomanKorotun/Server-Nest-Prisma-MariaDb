import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignupService } from './services/signup.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signinDto.js';
import { SigninService } from './services/signin.service.js';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly signinService: SigninService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.signupService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    await this.signinService.signin(signinDto, res);
    res.status(200).json({
      message: 'Access token and refresh token have been set in the cookies',
    });
  }
}
