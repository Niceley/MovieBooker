import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports : [
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global : true,
      secret : process.env.JWT_SECRET,
      signOptions : { expiresIn: '1h'}
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports : [AuthService]
})
export class AuthModule {}
