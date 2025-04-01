import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { TokenServise } from '../../common/services/token.service.js';
import { IJwtPayload } from '../../common/interfaces/auth.interface.js';
import { RefreshTokenDbService } from './refresh-token-db.service.js';

@Injectable()
export class RefreshService {
  constructor(
    private readonly tokenService: TokenServise,
    private readonly refreshTokenDbService: RefreshTokenDbService,
    private readonly configService: ConfigService,
  ) {}
  async refresh(req: Request, res: Response) {
    const { refreshToken: token } = req.cookies as Record<string, string>;

    if (!token) {
      throw new UnauthorizedException();
    }
    let decodeToken: IJwtPayload | null = null;
    try {
      decodeToken = this.tokenService.tokenVerify(
        token,
        'refresh',
      ) as IJwtPayload;
    } catch {
      throw new UnauthorizedException();
    }
    const { id, tokenIdentifier } = decodeToken;
    const oldRefreshToken =
      await this.refreshTokenDbService.findTokenByUserIdAndTokenIdentifier(
        id,
        tokenIdentifier,
      );

    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenDbService.removeTokenByUserIdAndTokenIdentifier(
      id,
      tokenIdentifier,
    );

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

    const newTokenIdentifier = nanoid();
    const accessToken = this.tokenService.tokenGenerate(
      id,
      newTokenIdentifier,
      'access',
    );

    const refreshToken = this.tokenService.tokenGenerate(
      id,
      newTokenIdentifier,
      'refresh',
    );

    await this.refreshTokenDbService.addToken(
      refreshToken,
      id,
      newTokenIdentifier,
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
