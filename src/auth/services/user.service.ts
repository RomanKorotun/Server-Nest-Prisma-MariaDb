import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prismaServise: PrismaService) {}

  async findUserByEmail(email: string) {
    return await this.prismaServise.user.findUnique({ where: { email } });
  }
}
