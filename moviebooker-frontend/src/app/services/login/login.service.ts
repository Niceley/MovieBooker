import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
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
    // Initialiser les informations utilisateur si un token existe
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

  private updateUserInfo(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.firstName && decodedToken.lastName) {
        this.userInfoSubject.next({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName
        });
      }
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      this.userInfoSubject.next(null);
    }
  }
}
