import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { MovieDetailComponent } from './movie-detail.component';
import { MovieDetailService } from '../../services/movie-detail/movie-detail.service';
import { LoginService } from '../../services/login/login.service';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  const mockMovieDetailService = {
    getMovieDetails: jasmine.createSpy('getMovieDetails').and.returnValue(of({
      id: 1,
      title: 'Mock Movie',
      overview: 'A mock overview',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 8,
      runtime: 120,
      genres: [],
      production_companies: []
    })),
    getMovieAvis: jasmine.createSpy('getMovieAvis').and.returnValue(of([])),
    createAvis: jasmine.createSpy('createAvis'),
    updateAvis: jasmine.createSpy('updateAvis'),
    deleteAvis: jasmine.createSpy('deleteAvis'),
  };

  const mockLoginService = {
    userInfo$: of(null),
    isLoggedIn: () => false,
    getCurrentUserId: () => null,
    getToken: () => null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        { provide: MovieDetailService, useValue: mockMovieDetailService },
        { provide: LoginService, useValue: mockLoginService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
