import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenServise {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  tokenGenerate(
    userId: number,
    tokenIdentifier: string,
    tokenType: 'access' | 'refresh',
  ) {
    const acceessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessTime = this.configService.get<string>('JWT_ACCESS_TIME');
    const refreshTime = this.configService.get<string>('JWT_REFRESH_TIME');

    if (!acceessSecret || !refreshSecret || !accessTime || !refreshTime) {
      throw new HttpException(
        'Missing required values: accessSecret, refreshSecret, accessTime, or refreshTime.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const parsedAccessTime = parseInt(accessTime, 10);
    const parsedRefreshTime = parseInt(refreshTime, 10);
    if (!parsedAccessTime || !parsedRefreshTime) {
      throw new HttpException(
        'Failed to convert JWT_ACCESS_TIME or JWT_REFRESH_TIME to number',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const payload = { id: userId, tokenIdentifier };

    if (tokenType === 'access') {
      return this.jwtService.sign(payload, {
        secret: acceessSecret,
        expiresIn: parsedAccessTime,
      });
    }

    if (tokenType === 'refresh') {
      return this.jwtService.sign(payload, {
        secret: refreshSecret,
        expiresIn: parsedRefreshTime,
      });
    }

    throw new HttpException(
      'Invalid token type provided',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  tokenVerify(token: string, tokenType: 'access' | 'refresh') {
    const acceessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!acceessSecret || !refreshSecret) {
      throw new HttpException(
        'Missing required values: accessSecret, refreshSecret',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (tokenType === 'access') {
      return this.jwtService.verify(token, {
        secret: acceessSecret,
      });
    }

    if (tokenType === 'refresh') {
      return this.jwtService.verify(token, {
        secret: refreshSecret,
      });
    }

    throw new HttpException(
      'Invalid token type provided',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
