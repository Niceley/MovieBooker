import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User as UserEntity } from '@prisma/client';
import { User } from 'src/shared/decorator';
import { AvisService } from './avis.service';
import { CreateAvisDto } from './dto/create-avis.dto';
import { UpdateAvisDto } from './dto/update-avis.dto';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @ApiOperation({ summary: 'Afficher les avis pour un film' })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Filtrer sur un mot clé présent dans le commentaire',
  })
  @ApiQuery({
    name: 'note',
    required: false,
    description: 'Filtrer sur une note exacte (0 à 5)',
    type: Number,
  })
  @Get('movie/:movieId')
  getAvisByMovie(
    @Param('movieId') movieId: string,
    @Query('keyword') keyword?: string,
    @Query('note') note?: string,
  ) {
    const parsedNote = note !== undefined ? Number(note) : undefined;
    const safeNote = parsedNote !== undefined && !Number.isNaN(parsedNote) ? parsedNote : undefined;

    return this.avisService.getAvisByMovie(Number(movieId), {
      keyword,
      note: safeNote,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un avis sur un film' })
  @ApiBody({ type: CreateAvisDto })
  @Post()
  createAvis(@User() user: UserEntity, @Body() data: CreateAvisDto) {
    return this.avisService.createAvis(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des avis de l’utilisateur' })
  @Get()
  getUserAvis(@User() user: UserEntity) {
    return this.avisService.getUserAvis(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un avis existant' })
  @Patch(':id')
  updateAvis(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Body() data: UpdateAvisDto,
  ) {
    return this.avisService.updateAvis(Number(id), user, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un avis' })
  @Delete(':id')
  deleteAvis(@Param('id') id: string, @User() user: UserEntity) {
    return this.avisService.deleteAvis(Number(id), user);
  }
}
