import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieDetailService } from './movie-detail.service';
import { LoginService } from '../login/login.service';
import { environment } from '../../../environments/environment';

class LoginServiceStub {
  getToken() {
    return 'test-token';
  }
}

describe('MovieDetailService', () => {
  let service: MovieDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LoginService, useClass: LoginServiceStub }],
    });
    service = TestBed.inject(MovieDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch movie details', () => {
    service.getMovieDetails(1).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/movie/detail/1`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should create avis with auth header', () => {
    service
      .createAvis({ movieId: 1, movieName: 'Test', note: 4, commentaire: 'Bien' })
      .subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/avis`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });
});
