import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  userInfo: { firstName: string; lastName: string } | null = null;
  private userInfoSubscription: Subscription | null = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.userInfoSubscription = this.loginService.userInfo$.subscribe(
      userInfo => {
        this.userInfo = userInfo;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.loginService.logout();
    window.location.reload();
  }
}
