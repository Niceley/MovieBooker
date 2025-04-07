import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'David', description: 'Prénom' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    example: 'davidwu.pro@gmail.com',
    description: 'Adresse email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
