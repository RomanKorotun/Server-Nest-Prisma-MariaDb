import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;
}
