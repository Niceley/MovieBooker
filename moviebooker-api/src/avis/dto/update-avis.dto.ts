import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min, IsString } from 'class-validator';

export class UpdateAvisDto {
  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  note?: number;

  @ApiPropertyOptional({
    example: 'Finalement, je révise ma note après un second visionnage',
  })
  @IsString()
  @IsOptional()
  commentaire?: string;
}

