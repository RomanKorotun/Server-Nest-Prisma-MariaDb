import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;
}
