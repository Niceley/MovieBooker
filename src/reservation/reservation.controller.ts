import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/shared/decorator';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary : 'Faire une réservation pour une séance'})
  @ApiBody({type : CreateReservationDto})
  @Post()
  async createReservation(
    @User() user: UserModel,
    @Body() reservationData : CreateReservationDto,
  ) {
    try {
      return await this.reservationService.reserveMovie(
        user,
        reservationData.movieId,
        reservationData.movieName,
        new Date(reservationData.date),
      );
    } catch (error) {
      return error.message;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary : 'Récupère la liste de vos réservations'})
  @Get()
  async getUserReservation(@User() user: UserModel) {
    return this.reservationService.getUserReservations(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary : 'Annuler une réservation'})
  @Delete(':id')
  async cancelReservation(@Param('id') reservationId: string) {
    try {
      return await this.reservationService.cancelReservation(
        Number(reservationId),
      );
    } catch (error) {
      return error.message;
    }
  }
}
