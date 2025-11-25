import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateAvisDto {
  @ApiProperty({
    example: 123,
    description: 'Identifiant du film concerné',
  })
  @IsNumber()
  movieId: number;

  @ApiProperty({
    example: 'Inception',
    description: 'Nom du film',
  })
  @IsString()
  movieName: string;

  @ApiProperty({
    example: 4.5,
    description: 'Note attribuée au film (0 à 5)',
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  note: number;

  @ApiProperty({
    example: 'Un excellent film de science-fiction',
    description: 'Commentaire de l’utilisateur',
  })
  @IsString()
  commentaire: string;
}

