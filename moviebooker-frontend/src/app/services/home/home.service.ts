import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse, Movie } from '../../models/movie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNowPlayingMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/now_playing`, {
      params: {
        page: page,
      },
    });
  }

  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/movie/search/movie?query=${query}&page=${page}`
    );
  }

  getMovieGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/genre/movie/list`);
  }

  getMovieDetails(movieId: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${movieId}`);
  }
}
