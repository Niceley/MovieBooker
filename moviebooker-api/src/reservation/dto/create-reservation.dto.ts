import { IsNumber, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    example: 123,
    description: 'ID du film',
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
    example: '2024-03-20T15:30:00Z',
    description: 'Date et heure de la séance',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    example: 'Cinéma Pathé',
    description: 'Nom du cinéma',
  })
  @IsString()
  cinemaName: string;
}
