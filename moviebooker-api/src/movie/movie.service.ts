import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class MovieService {
  constructor(private readonly httpService: HttpService) {}

  async getNowPlayingMovies(page: number) {
    return this.httpService
      .get(
        `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        },
      )
      .pipe(map((response) => response.data));
  }

  async searchMovie(query: string, page: number) {
    return this.httpService
      .get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=fr-FR&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        },
      )
      .pipe(map((response) => response.data));
  }

  async getMovieDetails(id: number) {
    return this.httpService
      .get(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      })
      .pipe(map((response) => response.data));
  }

  async getMovieGenre() {
    return this.httpService
      .get(`https://api.themoviedb.org/3/genre/movie/list?language=fr`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      })
      .pipe(map((response) => response.data));
  }
}
