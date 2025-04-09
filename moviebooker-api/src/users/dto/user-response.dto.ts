import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID Utilisateur' })
  id: number;
  @ApiProperty({ example: 'David', description: 'Prénom' })
  firstName: string;
  @ApiProperty({ example: 'WU', description: 'Nom' })
  lastName: string;
  @ApiProperty({
    example: 'davidwu.pro@gmail.com',
    description: 'Adresse email',
  })
  email: string;
}
