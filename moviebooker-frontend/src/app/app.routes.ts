import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'movie/:id',
        component: MovieDetailComponent
    },
    {
        path: 'register',
        component: InscriptionComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'reservation/:id/:name',
        component: ReservationComponent
    },
    {
        path: 'my-reservations',
        component: MyReservationComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
