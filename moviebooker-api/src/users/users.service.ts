import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getTestMessage() {
        return {
            message: 'Users service is working!',
            timestamp: new Date().toISOString()
        };
    }
}