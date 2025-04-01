import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service.js';

@Injectable()
export class RefreshTokenDbService {
  constructor(private readonly prismaServise: PrismaService) {}

  async addToken(token: string, userId: number, tokenIdentifier: string) {
    return await this.prismaServise.refreshToken.create({
      data: { token, tokenIdentifier, user: { connect: { id: userId } } },
    });
  }

  async findTokenByUserIdAndTokenIdentifier(
    userId: number,
    tokenIdentifier: string,
  ) {
    return await this.prismaServise.refreshToken.findUnique({
      where: { userId_tokenIdentifier: { userId, tokenIdentifier } },
    });
  }

  async removeTokenByUserIdAndTokenIdentifier(
    userId: number,
    tokenIdentifier: string,
  ) {
    return await this.prismaServise.refreshToken.delete({
      where: { userId_tokenIdentifier: { userId, tokenIdentifier } },
    });
  }
}
