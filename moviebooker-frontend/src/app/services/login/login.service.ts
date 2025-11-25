import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly TOKEN_KEY = 'auth_token';
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.updateUserInfo(token);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.access_token) {
            this.setToken(response.access_token);
            this.updateUserInfo(response.access_token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userInfoSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const decodedToken = this.decodeToken(token);
    return decodedToken?.sub ?? null;
  }

  private updateUserInfo(token: string): void {
    const decodedToken = this.decodeToken(token);

    if (decodedToken?.firstName && decodedToken?.lastName && decodedToken?.sub) {
      this.userInfoSubject.next({
        id: decodedToken.sub,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName
      });
      return;
    }

    this.userInfoSubject.next(null);
  }

  private decodeToken(token: string): any | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
}
