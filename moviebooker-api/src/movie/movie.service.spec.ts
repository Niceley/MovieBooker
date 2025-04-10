import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { HttpService } from '@nestjs/axios';
import { of, firstValueFrom } from 'rxjs';

describe('MovieService', () => {
  let service: MovieService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: 'Movie 1' },
            { id: 2, title: 'Movie 2' },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(await service.getNowPlayingMovies(1));

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1',
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('searchMovie', () => {
    it('should return search results', async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: 'Search Result 1' },
            { id: 2, title: 'Search Result 2' },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(await service.searchMovie('test', 1));

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie?query=test&include_adult=false&language=fr-FR&page=1',
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details', async () => {
      const mockResponse = {
        data: {
          id: 1,
          title: 'Movie Details',
          overview: 'Movie description',
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(await service.getMovieDetails(1));

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/1?language=fr-FR',
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMovieGenre', () => {
    it('should return movie genres', async () => {
      const mockResponse = {
        data: {
          genres: [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Comedy' },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(await service.getMovieGenre());

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/genre/movie/list?language=fr',
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
