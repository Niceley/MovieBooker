import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Avis } from '../../models/movie.model';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailService {
  constructor(private http: HttpClient, private loginService: LoginService) {}

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/movie/detail/${id}`);
  }

  getMovieAvis(
    id: number,
    filters?: { keyword?: string; note?: number | null }
  ): Observable<Avis[]> {
    let params = new HttpParams();

    if (filters?.keyword) {
      params = params.set('keyword', filters.keyword.trim());
    }

    if (filters?.note !== undefined && filters?.note !== null && filters.note !== ('' as any)) {
      params = params.set('note', filters.note.toString());
    }

    return this.http.get<Avis[]>(`${environment.apiUrl}/avis/movie/${id}`, {
      params,
    });
  }

  createAvis(payload: {
    movieId: number;
    movieName: string;
    note: number;
    commentaire: string;
  }): Observable<Avis> {
    return this.http.post<Avis>(`${environment.apiUrl}/avis`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  updateAvis(
    avisId: number,
    payload: { note?: number; commentaire?: string }
  ): Observable<Avis> {
    return this.http.patch<Avis>(`${environment.apiUrl}/avis/${avisId}`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteAvis(avisId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.apiUrl}/avis/${avisId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.loginService.getToken();

    if (!token) {
      throw new Error('Utilisateur non authentifié');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
