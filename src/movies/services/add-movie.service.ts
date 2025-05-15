import { Injectable } from '@nestjs/common';
import { AddMovieDto } from '../dto/add-movie.dto.js';
import { ICustomRequest } from '../../common/interfaces/auth.interface.js';
import { PrismaService } from '../../common/services/prisma.service.js';

@Injectable()
export class AddMovieService {
  constructor(private readonly prismaService: PrismaService) {}
  async addMovie(addMovieDto: AddMovieDto, req: ICustomRequest) {
    const { id } = req.user!;
    return await this.prismaService.movie.create({
      data: { ...addMovieDto, user: { connect: { id } } },
      select: {
        id: true,
        title: true,
        director: true,
        releaseYear: true,
        user: { select: { email: true } },
      },
    });
  }
}
