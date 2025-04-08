import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import e from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt : JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if(existingEmail) {
        throw new ConflictException('Email déjà utilisé')
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      },
    });

    const { password: _, ...result } = user;
    return result;

  }

  async signIn(email : string, password : string){
    const user = await this.prisma.user.findUnique({
        where : {email}
    })

    if(!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect')
    }

    const verifyPassword = await bcrypt.compare(password, user.password)

    if(!verifyPassword) {
        throw new UnauthorizedException('Email ou mot de passe incorrect')
    }

    const payload = {
        sub : user.id,
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName,
    }

    return {
        access_token: await this.jwt.signAsync(payload)
    }
  }
}
