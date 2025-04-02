import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller.js';
import { AddMovieService } from './services/add-movie.service.js';
import { PrismaService } from '../common/services/prisma.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { TokenServise } from '../common/services/token.service.js';

@Module({
  imports: [AuthModule],
  controllers: [MovieController],
  providers: [PrismaService, TokenServise, AddMovieService],
})
export class MovieModule {}
