import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieDetailService } from '../../services/movie-detail/movie-detail.service';
import { Avis, MovieDetails } from '../../models/movie.model';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie: MovieDetails | null = null;
  avisList: Avis[] = [];
  loading = true;
  avisLoading = true;
  isLoggedIn = false;
  userReview: Avis | null = null;
  reviewForm: FormGroup;
  filterForm: FormGroup;
  isEditing = false;
  submitting = false;
  errorMessage: string | null = null;
  readonly ratingOptions = [5,4.5,4,3.5,3,2.5,2,1.5,1,0.5,0,];

  private movieId: number | null = null;
  private userInfoSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private movieDetailService: MovieDetailService,
    private fb: FormBuilder,
    private loginService: LoginService,
  ) {
    this.reviewForm = this.fb.group({
      note: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      commentaire: ['', [Validators.required, Validators.maxLength(1000)]],
    });
    this.filterForm = this.fb.group({
      keyword: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    const movieIdParam = this.route.snapshot.paramMap.get('id');
    if (movieIdParam) {
      this.movieId = Number(movieIdParam);
      this.loadMovieDetails(this.movieId);
      this.loadMovieAvis(this.movieId);
    }

    this.isLoggedIn = this.loginService.isLoggedIn();
    this.userInfoSubscription = this.loginService.userInfo$.subscribe(() => {
      this.isLoggedIn = this.loginService.isLoggedIn();
      this.handleUserContextChange();
    });
  }

  ngOnDestroy(): void {
    this.userInfoSubscription?.unsubscribe();
  }

  loadMovieDetails(movieId: number): void {
    this.movieDetailService.getMovieDetails(movieId).subscribe(
      (data: MovieDetails) => {
        this.movie = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading movie details:', error);
        this.loading = false;
      }
    );
  }

  loadMovieAvis(movieId: number, filters?: { keyword?: string; note?: number }): void {
    this.avisLoading = true;
    const effectiveFilters = filters ?? this.getFilterValues();

    this.movieDetailService.getMovieAvis(movieId, effectiveFilters).subscribe({
      next: (data: Avis[]) => {
        this.avisList = data;
        this.avisLoading = false;
        this.updateUserReviewReference();
      },
      error: (error) => {
        console.error('Error loading movie reviews:', error);
        this.avisList = [];
        this.avisLoading = false;
        this.updateUserReviewReference();
      },
    });
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

  getAverageNote(): string {
    if (!this.avisList.length) {
      return '0.0';
    }
    const total = this.avisList.reduce((sum, avis) => sum + avis.note, 0);
    return (total / this.avisList.length).toFixed(1);
  }

  startEdit(): void {
    if (!this.userReview) {
      return;
    }
    this.isEditing = true;
    this.errorMessage = null;
    this.reviewForm.setValue({
      note: this.userReview.note,
      commentaire: this.userReview.commentaire,
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = null;
    this.reviewForm.reset();
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.movie || !this.movieId) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { note, commentaire } = this.reviewForm.value;

    if (note === null || note === undefined) {
      this.reviewForm.get('note')?.setErrors({ required: true });
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const request$ = this.userReview && this.isEditing
      ? this.movieDetailService.updateAvis(this.userReview.id, { note, commentaire })
      : this.movieDetailService.createAvis({
          movieId: this.movie.id,
          movieName: this.movie.title,
          note,
          commentaire,
        });

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.reviewForm.reset();
        this.isEditing = false;
        this.loadMovieAvis(this.movieId!, this.getFilterValues());
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      },
    });
  }

  deleteReview(avisId: number): void {
    if (!avisId || !this.movieId) {
      return;
    }

    const confirmed = confirm('Voulez-vous vraiment supprimer votre avis ?');
    if (!confirmed) {
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    this.movieDetailService.deleteAvis(avisId).subscribe({
      next: () => {
        this.submitting = false;
        this.reviewForm.reset();
        this.isEditing = false;
        this.loadMovieAvis(this.movieId!, this.getFilterValues());
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'Impossible de supprimer votre avis pour le moment.';
      },
    });
  }

  trackAvisById(_: number, avis: Avis): number {
    return avis.id;
  }

  applyFilters(): void {
    if (!this.movieId) {
      return;
    }
    this.loadMovieAvis(this.movieId, this.getFilterValues());
  }

  resetFilters(): void {
    this.filterForm.reset({
      keyword: '',
      note: '',
    });
    this.applyFilters();
  }

  filterFormHasCriteria(): boolean {
    if (!this.filterForm) {
      return false;
    }

    const keyword = this.filterForm.get('keyword')?.value;
    const note = this.filterForm.get('note')?.value;

    return (keyword && keyword.trim().length > 0) || note === 0 || !!note;
  }

  private getFilterValues(): { keyword?: string; note?: number } {
    if (!this.filterForm) {
      return {};
    }

    const keywordRaw = this.filterForm.get('keyword')?.value ?? '';
    const noteRaw = this.filterForm.get('note')?.value;

    const filters: { keyword?: string; note?: number } = {};

    if (keywordRaw && keywordRaw.trim().length > 0) {
      filters.keyword = keywordRaw.trim();
    }

    if (noteRaw !== '' && noteRaw !== null && noteRaw !== undefined) {
      const parsedNote = Number(noteRaw);
      if (!Number.isNaN(parsedNote)) {
        filters.note = parsedNote;
      }
    }

    return filters;
  }

  private handleUserContextChange(): void {
    if (!this.movieId) {
      return;
    }

    if (!this.loginService.isLoggedIn()) {
      this.userReview = null;
      this.isEditing = false;
      this.reviewForm.reset();
      return;
    }

    this.updateUserReviewReference();
  }

  private updateUserReviewReference(): void {
    const currentUserId = this.loginService.getCurrentUserId();
    if (!currentUserId) {
      this.userReview = null;
      this.isEditing = false;
      return;
    }

    this.userReview = this.avisList.find((avis) => avis.userId === currentUserId) ?? null;

    if (!this.userReview) {
      this.isEditing = false;
    }
  }
}
