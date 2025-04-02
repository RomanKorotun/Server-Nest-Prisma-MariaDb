import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AddMovieService } from './services/add-movie.service.js';
import { AddMovieDto } from './dto/add-movie.dto.js';
import { ICustomRequest } from '../common/interfaces/auth.interface.js';
import { AuthenticateGuard } from '../common/guards/authenticate.guard.js';

@Controller('movie')
@UseGuards(AuthenticateGuard)
export class MovieController {
  constructor(private readonly addMovieService: AddMovieService) {}

  @Post()
  async addMovie(@Body() addMovieDto: AddMovieDto, @Req() req: ICustomRequest) {
    return await this.addMovieService.addMovie(addMovieDto, req);
  }
}
