import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginService } from '../login/login.service';

export interface Reservation {
  id: number;
  movieId: number;
  movieName: string;
  date: string;
  moviePoster?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MyReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  cancelReservation(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
