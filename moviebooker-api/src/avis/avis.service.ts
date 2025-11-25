import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Avis, Prisma, User } from '@prisma/client';
import { CreateAvisDto } from './dto/create-avis.dto';
import { UpdateAvisDto } from './dto/update-avis.dto';

@Injectable()
export class AvisService {
  private readonly avisInclude = {
    user: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
  };
  constructor(private readonly prisma: PrismaService) {}

  async createAvis(user: User, data: CreateAvisDto) {
    const existing = await this.prisma.avis.findFirst({
      where: {
        userId: user.id,
        movieId: data.movieId,
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'Vous avez déjà laissé un avis pour ce film. Modifiez-le plutôt.',
      );
    }

    const avis = await this.prisma.avis.create({
      data: {
        userId: user.id,
        ...data,
      },
      include: this.avisInclude,
    });

    return this.formatAvis(avis);
  }

  async getUserAvis(user: User) {
    const avisList = await this.prisma.avis.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: this.avisInclude,
    });
    return avisList.map((avis) => this.formatAvis(avis));
  }

  async getAvisByMovie(
    movieId: number,
    filters?: { keyword?: string; note?: number },
  ) {
    const where: Prisma.AvisWhereInput = {
      movieId,
    };

    if (filters?.keyword) {
      where.commentaire = {
        contains: filters.keyword,
        mode: 'insensitive',
      };
    }

    if (filters?.note !== undefined && filters?.note !== null) {
      where.note = filters.note;
    }

    const avisList = await this.prisma.avis.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: this.avisInclude,
    });
    return avisList.map((avis) => this.formatAvis(avis));
  }

  async updateAvis(id: number, user: User, data: UpdateAvisDto) {
    const avis = await this.prisma.avis.findUnique({ where: { id } });

    if (!avis) {
      throw new NotFoundException(`Avis #${id} non trouvé`);
    }

    if (avis.userId !== user.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos avis.');
    }

    const updatedAvis = await this.prisma.avis.update({
      where: { id },
      data,
      include: this.avisInclude,
    });
    return this.formatAvis(updatedAvis);
  }

  async deleteAvis(id: number, user: User) {
    const avis = await this.prisma.avis.findUnique({ where: { id } });

    if (!avis) {
      throw new NotFoundException(`Avis #${id} non trouvé`);
    }

    if (avis.userId !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos avis.');
    }

    await this.prisma.avis.delete({ where: { id } });

    return { message: 'Avis supprimé' };
  }

  private formatAvis(
    avis: Avis & { user?: { firstName: string | null; lastName: string | null } | null },
  ) {
    const { user, ...rest } = avis;
    return {
      ...rest,
      userFirstName: user?.firstName ?? 'Utilisateur',
      userLastName: user?.lastName ?? '',
    };
  }
}
