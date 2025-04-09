import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async reserveMovie(
    user: User,
    movieId: number,
    movieName: string,
    date: Date,
  ) {
    const twoHoursBefore = new Date(date.getTime() - 1 * 60 * 60 + 59 * 60 + 59 * 1000);
    const twoHoursAfter = new Date(date.getTime() + 1 * 60 * 60 + 59 * 60 + 59 * 1000);

    const existingReservation = await this.prisma.reservartion.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: twoHoursBefore,
          lte: twoHoursAfter,
        },
      },
    });

    if (existingReservation) {
      throw new Error(
        'Vous avez déjà une réservation dans un interval de 2 heures',
      );
    }

    return this.prisma.reservartion.create({
      data: {
        userId: user.id,
        movieId: movieId,
        movieName: movieName,
        date: date,
      },
    });
  }

  async getUserReservations(user: User) {
    try {
      return await this.prisma.reservartion.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      throw new Error('Erreur lors de la récupération des réservations');
    }
  }

  async cancelReservation(reservationId: number) {
    const reservation = await this.prisma.reservartion.findUnique({
      where: { id: reservationId },
    });

    if(!reservation) {
        throw new Error('Réservation non trouvé')
    }

    await this.prisma.reservartion.delete({
        where : {id : reservationId}
    })

    return 'Réservation annulé'

  }
}
