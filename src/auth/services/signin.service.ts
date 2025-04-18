import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { nanoid } from 'nanoid';
import { SigninDto } from '../dto/signinDto.js';
import { UserService } from './user.service.js';
import { PasswordService } from './password.service.js';
import { TokenServise } from '../../common/services/token.service.js';
import { RefreshTokenDbService } from './refresh-token-db.service.js';

@Injectable()
export class SigninService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenServise,
    private readonly configService: ConfigService,
    private readonly refreshTokenDbService: RefreshTokenDbService,
  ) {}
  async signin(signinDto: SigninDto, res: Response) {
    const { email, password } = signinDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email is password is wrong');
    }

    const comparePassword = await this.passwordService.comparePassword(
      password,
      user.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (!nodeEnv) {
      throw new HttpException(
        'Missing required value NODE_ENV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const accessTime = this.configService.get<string>('JWT_ACCESS_TIME');
    if (!accessTime) {
      throw new HttpException(
        'Missing required value accessTime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const parsedAccessTime = parseInt(accessTime, 10);
    if (!parsedAccessTime) {
      throw new HttpException(
        'Failed to convert JWT_ACCESS_TIME to number',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const tokenIdentifier = nanoid();

    const accessToken = this.tokenService.tokenGenerate(
      user.id,
      tokenIdentifier,
      'access',
    );
    const refreshToken = this.tokenService.tokenGenerate(
      user.id,
      tokenIdentifier,
      'refresh',
    );

    await this.refreshTokenDbService.addToken(
      refreshToken,
      user.id,
      tokenIdentifier,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: parsedAccessTime * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
    });
  }
}
