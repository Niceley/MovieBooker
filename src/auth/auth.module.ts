import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports : [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      global : true,
      secret : process.env.JWT_SECRET,
      signOptions : { expiresIn: '1h'}
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports : [AuthService]
})
export class AuthModule {}
