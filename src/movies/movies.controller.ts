import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddMovieService } from './services/add-movie.service.js';
import { AddMovieDto } from './dto/add-movie.dto.js';
import { ICustomRequest } from '../common/interfaces/auth.interface.js';
import { AuthenticateGuard } from '../common/guards/authenticate.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('movie')
@UseGuards(AuthenticateGuard)
export class MovieController {
  constructor(private readonly addMovieService: AddMovieService) {}

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  async addMovie(@Body() addMovieDto: AddMovieDto, @Req() req: ICustomRequest) {
    return await this.addMovieService.addMovie(addMovieDto, req);
  }
}
