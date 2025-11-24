import { Injectable, NotFoundException } from '@nestjs/common';
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
    const reservationDate = new Date(date);

    const timeInterval = 119 * 60 * 1000;
    const startDate = new Date(reservationDate.getTime() - timeInterval);
    const endDate = new Date(reservationDate.getTime() + timeInterval);

    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    
    if (existingReservation) {
      const existingDate = new Date(existingReservation.date);
      throw new Error(
        `Vous avez déjà une réservation le ${existingDate.toLocaleDateString()} à ${existingDate.toLocaleTimeString()}. Un délai de 1h59 est requis entre deux séances.`,
      );
    }

    return this.prisma.reservation.create({
      data: {
        userId: user.id,
        movieId: movieId,
        movieName: movieName,
        date: reservationDate,
      },
    });
  }

  async getUserReservations(user: User) {
    try {
      return await this.prisma.reservation.findMany({
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
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if(!reservation) {
      throw new Error('Réservation non trouvée');
    }

    await this.prisma.reservation.delete({
      where: { id: reservationId }
    });

    return { message: 'Réservation annulée' };
  }

  async getReservationById(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation #${id} non trouvée`);
    }

    return reservation;
  }
}
