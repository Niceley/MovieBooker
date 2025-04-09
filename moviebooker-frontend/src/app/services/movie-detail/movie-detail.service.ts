import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailService {
  constructor(private http: HttpClient) {}

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/movie/detail/${id}`);
  }
}
