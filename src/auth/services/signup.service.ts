import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service.js';
import { UserService } from './user.service.js';
import { SignupDto } from '../dto/signup.dto.js';
import { PasswordService } from './password.service.js';

@Injectable()
export class SignupService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password } = signupDto;
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new ConflictException(
        'User with this address is already registered',
      );
    }

    const hashPassword = await this.passwordService.hashPassword(password);

    return await this.prismaService.user.create({
      data: { ...signupDto, password: hashPassword },
      select: { id: true, username: true, email: true },
    });
  }
}
