import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MovieService } from './movie.service';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get('now_playing')
    @ApiOperation({ summary: 'Les films en salle actuellement' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Pagination' })
    async getNowPlayingMovies(@Query('page') page: number = 1) {
        return this.movieService.getNowPlayingMovies(page)
    }

    @Get('search/movie')
    @ApiOperation({ summary: 'Recherche de film' })
    @ApiQuery({ name: 'query', required: true, type: String, description: "Recherche d'un film" })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Pagination' })
    async searchMovie(@Query('query') query: string, @Query('page') page: number = 1) {
        return this.movieService.searchMovie(query, page)
    }

    @Get('detail')
    @ApiOperation({ summary: "Récupère les détails d'un film" })
    @ApiQuery({ name: 'id', required: true, type: Number, description: 'ID du film' })
    async getMovieDetails(@Query('id') id: number) {
        return this.movieService.getMovieDetails(id)
    }

    @Get('genre/movie/list')
    @ApiOperation({ summary: 'Récupère la liste des genres des films' })
    async getMovieGenre(){
        return this.movieService.getMovieGenre()
    }
}
