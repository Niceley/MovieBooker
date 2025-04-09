import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports : [HttpModule, PrismaModule],
    controllers : [MovieController],
    providers : [MovieService],
    exports : [MovieService],
})
export class MovieModule {}
