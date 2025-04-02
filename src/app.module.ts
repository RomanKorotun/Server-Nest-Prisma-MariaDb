import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MovieModule } from './movie/movie.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    AuthModule,
    MovieModule,
  ],
})
export class AppModule {}
