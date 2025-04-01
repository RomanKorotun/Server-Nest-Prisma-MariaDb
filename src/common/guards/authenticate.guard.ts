import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenServise } from '../services/token.service.js';
import { ICustomRequest, IJwtPayload } from '../interfaces/auth.interface.js';
import { UserService } from '../../auth/services/user.service.js';

@Injectable()
export class AuthenticateGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenServise,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ICustomRequest>();

    const { accessToken } = req.cookies as Record<string, string>;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    let decodeToken: IJwtPayload | null = null;
    try {
      decodeToken = this.tokenService.tokenVerify(
        accessToken,
        'access',
      ) as IJwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.findUserById(decodeToken.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req['user'] = user;

    return true;
  }
}
