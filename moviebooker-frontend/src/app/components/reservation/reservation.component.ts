import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { LoginService } from '../../services/login/login.service';
import { HomeService } from '../../services/home/home.service';
import { MovieDetailService } from '../../services/movie-detail/movie-detail.service';
import { MovieDetails } from '../../models/movie.model';

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
  movieRuntime: number = 120; // Durée par défaut en minutes (2h)
  selectedDate: string = '';
  selectedTime: string = '';
  selectedCinema: string = '';
  availableTimes: string[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  cinemas: string[] = [
    'Cinéma Pathé',
    'Cinéma Gaumont',
    'Cinéma UGC',
    'Cinéma MK2',
    'Cinéma Le Grand Rex',
    'Cinéma Studio',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private loginService: LoginService,
    private homeService: HomeService,
    private movieDetailService: MovieDetailService
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
      this.movieDetailService.getMovieDetails(id).subscribe({
        next: (movie: MovieDetails) => {
          this.moviePoster = movie.poster_path;
          if (movie.runtime) {
            this.movieRuntime = movie.runtime;
          }
          this.generateAvailableTimes();
        },
        error: (error: any) => {
          console.error('Error fetching movie details:', error);
          this.moviePoster = '';
          this.generateAvailableTimes();
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

    if (!this.selectedCinema) {
      this.errorMessage = 'Veuillez sélectionner un cinéma';
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
    this.reservationService.reserveMovie(this.movieId, this.movieName, reservationDate, this.selectedCinema)
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

  generateAvailableTimes(): void {
    const times: string[] = [];
    const startHour = 10;
    const endHour = 20;
    const runtimeMinutes = this.movieRuntime;
    
    const intervalMinutes = runtimeMinutes + 15;
    
    let currentHour = startHour;
    let currentMinute = 0;
    
    while (true) {
      if (currentHour > endHour) {
        break;
      }
      if (currentHour === endHour && currentMinute > 0) {
        break;
      }
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      times.push(timeString);
      currentMinute += intervalMinutes;
      while (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }
    
    this.availableTimes = times;
  }

  formatRuntime(): string {
    const hours = Math.floor(this.movieRuntime / 60);
    const minutes = this.movieRuntime % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }
}
