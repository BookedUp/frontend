import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Reservation} from "../model/reservation.model";
import {ReservationService} from "../reservation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../infrastructure/auth/auth.service";
import {ReservationStatus} from "../model/reservationStatus.enum";
import Swal from "sweetalert2";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

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
    if (this.filter === 'all') {
      this.reservations = this.reservationService.getReservationsByGuestId(this.authService.getUserID());
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

  getGuestsReservations() {
    this.selectedClass = 'all-reservation';
    this.router.navigate(['my-reservations'], { queryParams: { filter: 'all' } });
    this.reservations = this.reservationService.getReservationsByGuestId(this.authService.getUserID());
  }


  getGuestsReservationsByStatus(className: string, status: ReservationStatus) {
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

    this.reservations = this.reservationService.getReservationsByStatusAndGuestId(this.authService.getUserID(), status);
  }

}
