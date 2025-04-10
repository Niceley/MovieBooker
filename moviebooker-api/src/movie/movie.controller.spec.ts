import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { of } from 'rxjs';

describe('MovieController', () => {
  let controller: MovieController;
  let movieService: MovieService;

  const mockMovieService = {
    getNowPlayingMovies: jest.fn(),
    searchMovie: jest.fn(),
    getMovieDetails: jest.fn(),
    getMovieGenre: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', async () => {
      const mockResponse = {
        results: [
          { id: 1, title: 'Movie 1' },
          { id: 2, title: 'Movie 2' },
        ],
      };

      mockMovieService.getNowPlayingMovies.mockReturnValue(of(mockResponse));

      const result = await controller.getNowPlayingMovies(1);

      expect(movieService.getNowPlayingMovies).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });

    it('should use default page value if not provided', async () => {
      const mockResponse = {
        results: [
          { id: 1, title: 'Movie 1' },
          { id: 2, title: 'Movie 2' },
        ],
      };

      mockMovieService.getNowPlayingMovies.mockReturnValue(of(mockResponse));

      const result = await controller.getNowPlayingMovies();

      expect(movieService.getNowPlayingMovies).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });
  });

  describe('searchMovie', () => {
    it('should return search results', async () => {
      const mockResponse = {
        results: [
          { id: 1, title: 'Search Result 1' },
          { id: 2, title: 'Search Result 2' },
        ],
      };

      mockMovieService.searchMovie.mockReturnValue(of(mockResponse));

      const result = await controller.searchMovie('test', 1);

      expect(movieService.searchMovie).toHaveBeenCalledWith('test', 1);
      expect(result).toBeDefined();
    });

    it('should use default page value if not provided', async () => {
      const mockResponse = {
        results: [
          { id: 1, title: 'Search Result 1' },
          { id: 2, title: 'Search Result 2' },
        ],
      };

      mockMovieService.searchMovie.mockReturnValue(of(mockResponse));

      const result = await controller.searchMovie('test');

      expect(movieService.searchMovie).toHaveBeenCalledWith('test', 1);
      expect(result).toBeDefined();
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details', async () => {
      const mockResponse = {
        id: 1,
        title: 'Movie Details',
        overview: 'Movie description',
      };

      mockMovieService.getMovieDetails.mockReturnValue(of(mockResponse));

      const result = await controller.getMovieDetails(1);

      expect(movieService.getMovieDetails).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });
  });

  describe('getMovieGenre', () => {
    it('should return movie genres', async () => {
      const mockResponse = {
        genres: [
          { id: 1, name: 'Action' },
          { id: 2, name: 'Comedy' },
        ],
      };

      mockMovieService.getMovieGenre.mockReturnValue(of(mockResponse));

      const result = await controller.getMovieGenre();

      expect(movieService.getMovieGenre).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
