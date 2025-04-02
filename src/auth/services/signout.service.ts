import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { TokenServise } from '../../common/services/token.service.js';
import {
  ICustomRequest,
  IJwtPayload,
} from '../../common/interfaces/auth.interface.js';
import { RefreshTokenDbService } from './refresh-token-db.service.js';

@Injectable()
export class SignoutService {
  constructor(
    private readonly tokenService: TokenServise,
    private readonly refreshTokenDbService: RefreshTokenDbService,
  ) {}
  async signout(req: ICustomRequest, res: Response) {
    const { refreshToken } = req.cookies as Record<string, string>;
    const { id, tokenIdentifier } = this.tokenService.tokenDecode(
      refreshToken,
    ) as IJwtPayload;

    await this.refreshTokenDbService.removeTokenByUserIdAndTokenIdentifier(
      id,
      tokenIdentifier,
    );

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
