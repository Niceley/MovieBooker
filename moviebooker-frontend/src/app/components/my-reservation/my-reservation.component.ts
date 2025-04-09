import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyReservationService, Reservation } from '../../services/my-reservation/my-reservation.service';

@Component({
  selector: 'app-my-reservation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-reservation.component.html',
  styleUrl: './my-reservation.component.scss'
})
export class MyReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private reservationService: MyReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = null;
    this.reservationService.getUserReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.error = 'Une erreur est survenue lors du chargement de vos réservations.';
        this.loading = false;
      }
    });
  }

  cancelReservation(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.successMessage = 'Réservation annulée avec succès.';
        this.reservations = this.reservations.filter(r => r.id !== id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error canceling reservation:', error);
        this.error = "Une erreur est survenue lors de l'annulation de la réservation.";
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
