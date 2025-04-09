export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

export interface MovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    runtime: number;
    genres: { id: number; name: string }[];
    production_companies: { name: string; logo_path: string }[];
}

export interface MovieResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
  }
  