import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/reservation/model/reservation.model';
import { ReservationStatus } from 'src/app/reservation/model/reservationStatus.enum';
import { ReservationService } from 'src/app/reservation/reservation.service';
import {AuthService} from "../../infrastructure/auth/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-reservation-requests',
  templateUrl: './reservation-requests.component.html',
  styleUrls: ['./reservation-requests.component.css', '../../../styles.css']
})
export class ReservationRequestsComponent implements OnInit {

  reservations: Observable<Reservation[]> = new Observable<Reservation[]>();
  selectedClass: string = 'all-reservation';
  filter: string = 'all';
  constructor(private reservationService: ReservationService, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  protected readonly ReservationStatus = ReservationStatus;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadReservations();
      console.log(this.reservations);
    });
  }

  private loadReservations(): void {
    if (this.filter === 'waiting') {
      this.reservations = this.reservationService.getReservationsByStatusAndHostId(this.authService.getUserID(), ReservationStatus.Created);
    } else if (this.filter === 'accepted') {
      this.reservations = this.reservationService.getReservationsByStatusAndHostId(this.authService.getUserID(), ReservationStatus.Created);
    } else if (this.filter === 'rejected') {
      this.reservations = this.reservationService.getReservationsByStatusAndHostId(this.authService.getUserID(), ReservationStatus.Created);
    } else if (this.filter === 'finished') {
      this.reservations = this.reservationService.getReservationsByStatusAndHostId(this.authService.getUserID(), ReservationStatus.Created);
    } else if (this.filter === 'cancelled') {
      this.reservations = this.reservationService.getReservationsByStatusAndHostId(this.authService.getUserID(), ReservationStatus.Created);
    }

    else {
      //this.reservations = this.reservationService.getReservationsByHostId(2);
      this.reservations = this.reservationService.getReservationsByHostId(this.authService.getUserID());
    }
  }

  generateStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('★');
      } else if (i - 0.5 === rating) {
        stars.push('✯');
      } else {
        stars.push('☆');
      }
    }
    return stars;
  }

  roundHalf(value: number): number {
    return Math.round(value * 2) / 2;
  }


  acceptReservation(id: number): void {
    this.reservationService.approveReservation(id)
        .subscribe(
            (approvedReservation) => {
              Swal.fire({
                icon: 'success',
                title: 'Reservation Approved!',
                text: 'The reservation has been successfully approved.',
              }).then(() => {
                this.loadReservations();
              });
            },
            (error) => {
              // Handle error
              Swal.fire({
                icon: 'error',
                title: 'Error Approving Reservation',
                text: `An error occurred: ${error.message}`,
              });
            }
        );
  }

  rejectReservation(id: number): void {
    this.reservationService.rejectReservation(id)
        .subscribe(
            (rejectedReservation) => {
              Swal.fire({
                icon: 'success',
                title: 'Reservation Rejected!',
                text: 'The reservation has been successfully rejected.',
              }).then(() => {
                this.loadReservations();
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error Rejecting Reservation',
                text: `An error occurred: ${error.message}`,
              });
            }
        );
  }

  getHostsReservations() {
    this.selectedClass = 'all-reservation';
    this.router.navigate(['my-reservations'], { queryParams: { filter: 'all' } });
    this.reservations = this.reservationService.getReservationsByHostId(this.authService.getUserID());
  }


  getHostsReservationsByStatus(className: string, status: ReservationStatus) {
    this.selectedClass = className;
    if (className === 'waiting-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'waiting' } });
    } else if (className === 'accepted-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'accepted' } });
    } else if (className === 'rejected-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'rejected' } });
    } else if (className === 'finished-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'finished' } });
    } else {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'cancelled' } });
    }

    this.reservations = this.reservationService.getReservationsByStatusAndHostId(this.authService.getUserID(), status);
  }
}
