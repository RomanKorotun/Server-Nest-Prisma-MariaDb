import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SignupService } from './services/signup.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signinDto.js';
import { SigninService } from './services/signin.service.js';
import { CurrentService } from './services/current.service.js';
import { AuthenticateGuard } from '../common/guards/authenticate.guard.js';
import { ICustomRequest } from '../common/interfaces/auth.interface.js';
import { RefreshService } from './services/refresh.service.js';
import { SignoutService } from './services/signout.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly signinService: SigninService,
    private readonly currentService: CurrentService,
    private readonly refreshService: RefreshService,
    private readonly signoutService: SignoutService,
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

  @Get('current')
  @UseGuards(AuthenticateGuard)
  current(@Req() req: ICustomRequest) {
    return this.currentService.current(req);
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    await this.refreshService.refresh(req, res);
    res.status(200).json({
      message: 'Access token and refresh token have been set in the cookies',
    });
  }

  @Post('signout')
  @UseGuards(AuthenticateGuard)
  async signout(@Req() req: ICustomRequest, @Res() res: Response) {
    await this.signoutService.signout(req, res);
    res.status(200).json({ message: 'Logout success' });
  }
}
