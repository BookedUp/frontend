import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/core/model/Reservation';
import { ReservationStatus } from 'src/app/core/model/enum/ReservationStatus';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-reservation-requests',
  templateUrl: './reservation-requests.component.html',
  styleUrls: ['./reservation-requests.component.css', '../../styles.css']
})
export class ReservationRequestsComponent implements OnInit {

  reservations: Observable<Reservation[]> = new Observable<Reservation[]>();
  selectedClass: string = 'all-reservation';
  filter: string = 'all';
  constructor(private reservationService: ReservationService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadReservations();
      console.log(this.reservations);
    });
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    if (className === 'waiting-reservation') {
      this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'waiting' } });
    } else if (className === 'accepted-reservation') {
      this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'accepted' } });
    } else if (className === 'rejected-reservation') {
      this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'rejected' } });
    } else if (className === 'finished-reservation') {
      this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'finished' } });
    } else if (className === 'cancelled-reservation') {
      this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'cancelled' } });
    } else {
      this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'all' } });
    }
  }
  navigateToDetails(id: number) {
    this.router.navigate(['/accommodation-details', id], { queryParams: { role: 'host' }});
  }
  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.Created:
        return 'created-status';
      case ReservationStatus.Reject:
        return 'rejected-status';
      case ReservationStatus.Accept:
        return 'accepted-status';
      case ReservationStatus.Cancelled:
        return 'cancelled-status';
      case ReservationStatus.Completed:
        return 'completed-status';
      default:
        return 'acc-frame';
    }
  }

  private loadReservations(): void {
    //this.reservations = this.reservationService.getReservationsByHostId(2);

    if (this.filter === 'waiting') {
      this.reservations = this.reservationService.getCreatedReservationsByHostId(2);
    } else if (this.filter === 'accepted') {
      this.reservations = this.reservationService.getAcceptedReservationsByHostId(2);
    } else if (this.filter === 'rejected') {
      this.reservations = this.reservationService.getRejectedReservationsByHostId(2);
    } else if (this.filter === 'finished') {
      this.reservations = this.reservationService.getCompletedReservationsByHostId(2);
    } else if (this.filter === 'cancelled') {
      this.reservations = this.reservationService.getCancelledReservationsByHostId(2);
    }

    else {
      //this.reservations = this.reservationService.getReservationsByHostId(2);
      this.reservations = this.reservationService.getAllReservations();
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

  acceptReservation() {
  }

  rejectReservation() {

  }
}
