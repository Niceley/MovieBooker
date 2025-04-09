import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginService } from '../login/login.service';

export interface Reservation {
  id: number;
  userId: number;
  movieId: number;
  movieName: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  reserveMovie(movieId: number, movieName: string, date: Date): Observable<Reservation> {
    return this.http.post<Reservation>(
      this.apiUrl,
      { movieId, movieName, date },
      { headers: this.getHeaders() }
    );
  }

  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/user`,
      { headers: this.getHeaders() }
    );
  }

  cancelReservation(reservationId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}/${reservationId}`,
      { headers: this.getHeaders() }
    );
  }
}
