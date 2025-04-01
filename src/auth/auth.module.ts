import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { SignupService } from './services/signup.service.js';
import { PrismaService } from '../common/services/prisma.service.js';
import { UserService } from './services/user.service.js';
import { PasswordService } from './services/password.service.js';
import { SigninService } from './services/signin.service.js';
import { TokenServise } from '../common/services/token.service.js';

@Module({
  controllers: [AuthController],
  providers: [
    SignupService,
    SigninService,
    UserService,
    PasswordService,
    PrismaService,
    TokenServise,
  ],
})
export class AuthModule {}
