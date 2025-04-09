import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  constructor(
    private homeService: HomeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(page: number = 1): void {
    this.currentPage = page;
    this.homeService
      .getNowPlayingMovies(page)
      .subscribe((data: any) => {
        this.movies = data.results;
        this.totalPages = data.total_pages;
        this.totalResults = data.total_results;
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadMovies(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadMovies(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadMovies(page);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  viewDetails(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }
}
