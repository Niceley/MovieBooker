import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscrire un nouvel utilisateur' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  async register(@Body() CreateUserDto) {
    return this.authService.register(CreateUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter avec un email et un mot de passe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' }
      }
    }
  })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() signUpBody: { email: string, password: string }) {
    return await this.authService.signIn(signUpBody.email, signUpBody.password)
  }
}
