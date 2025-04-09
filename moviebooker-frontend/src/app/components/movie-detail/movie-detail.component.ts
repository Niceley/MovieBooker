import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { MovieDetailService } from '../../services/movie-detail/movie-detail.service';
import { MovieDetails } from '../../models/movie.model';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MovieDetailComponent implements OnInit {
  movie: MovieDetails | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private movieDetailService: MovieDetailService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovieDetails(+movieId);
    }
  }

  loadMovieDetails(movieId: number): void {
    this.movieDetailService.getMovieDetails(movieId).subscribe(
      (data: any) => {
        this.movie = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading movie details:', error);
        this.loading = false;
      }
    );
  }

  getFormattedRuntime(): string {
    if (!this.movie?.runtime) return '';
    const hours = Math.floor(this.movie.runtime / 60);
    const minutes = this.movie.runtime % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
  }

  getFormattedDate(): string {
    if (!this.movie?.release_date) return '';
    return new Date(this.movie.release_date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
