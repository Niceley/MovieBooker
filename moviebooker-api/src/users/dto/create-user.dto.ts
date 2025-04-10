import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
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
  @IsEmail({}, { message: 'Veuillez entrer une adresse email valide' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: 'Le format de l\'email n\'est pas valide (exemple: nom@domaine.com)' }
  )
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe (minimum 8 caractères, au moins une majuscule, un chiffre et un caractère spécial)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
  @Matches(/(?=.*[0-9])/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)' })
  password: string;
}
