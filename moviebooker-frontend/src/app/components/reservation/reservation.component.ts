import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { LoginService } from '../../services/login/login.service';
import { HomeService } from '../../services/home/home.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReservationComponent implements OnInit {
  movieId: number | null = null;
  movieName: string = '';
  moviePoster: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private loginService: LoginService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url 
        } 
      });
      return;
    }

    this.route.params.subscribe(params => {
      const id = +params['id'];
      const name = params['name'];
      
      if (!id || !name) {
        this.errorMessage = 'Informations du film manquantes';
        this.isLoading = false;
        return;
      }

      this.movieId = id;
      this.movieName = name;

      this.homeService.getMovieDetails(id).subscribe({
        next: (movie: Movie) => {
          this.moviePoster = movie.poster_path;
        },
        error: (error: any) => {
          console.error('Error fetching movie details:', error);
          this.moviePoster = '';
        }
      });
    });
  }

  onSubmit(): void {
    if (!this.movieId || !this.movieName) {
      this.errorMessage = 'Informations du film manquantes';
      return;
    }

    if (!this.selectedDate || !this.selectedTime) {
      this.errorMessage = 'Veuillez sélectionner une date et une heure';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const [year, month, day] = this.selectedDate.split('-');
    const [hours, minutes] = this.selectedTime.split(':');
    const reservationDate = new Date(
      +year,
      +month - 1,
      +day,
      +hours,
      +minutes
    );
    this.reservationService.reserveMovie(this.movieId, this.movieName, reservationDate)
      .subscribe({
        next: () => {
          this.successMessage = 'Réservation effectuée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Reservation error:', error);
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la réservation';
          this.isLoading = false;
        }
      });
  }

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get maxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  }
}
