import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../model/accommodation.model';
import { Observable } from 'rxjs';
import Swal from "sweetalert2";

@Component({
  selector: 'app-accommodation-requests',
  templateUrl: './accommodation-requests.component.html',
  styleUrls: ['./accommodation-requests.component.css', '../../../styles.css']
})
export class AccommodationRequestsComponent implements OnInit{
  accommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
  selectedClass: string = 'all-accommodations';
  filter: string = 'all';
  constructor(private accommodationService: AccommodationService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadAccommodations();
    });
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    if (className === 'changed-accommodations') {
      this.router.navigate(['/accommodation-requests'], { queryParams: { filter: 'changed' } });
    } else if (className === 'new-accommodations') {
      this.router.navigate(['/accommodation-requests'], { queryParams: { filter: 'new' } });
    } else {
      this.router.navigate(['/accommodation-requests'], { queryParams: { filter: 'all' } });
    }
  }

  private loadAccommodations(): void {
    if (this.filter === 'all') {
      this.accommodations = this.accommodationService.getAllModifiedAccommodations();
    } else if (this.filter === 'new') {
      this.accommodations = this.accommodationService.getAllCreatedAccommodations();
    } else {
      this.accommodations = this.accommodationService.getAllChangedAccommodations();
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

  approveAccommodation(id: number): void {
    this.accommodationService.approveAccommodation(id)
        .subscribe(
            (approvedReservation) => {
              Swal.fire({
                icon: 'success',
                title: 'Accommodation Approved!',
                text: 'The accommodation has been successfully approved.',
              }).then(() => {
                this.loadAccommodations();
              });
            },
            (error) => {
              // Handle error
              Swal.fire({
                icon: 'error',
                title: 'Error Approving Accommodation',
                text: `An error occurred: ${error.message}`,
              });
            }
        );
  }

  rejectAccommodation(id: number): void {
    this.accommodationService.rejectAccommodation(id)
        .subscribe(
            (rejectedReservation) => {
              Swal.fire({
                icon: 'success',
                title: 'Accommodation Rejected!',
                text: 'The accommodation has been successfully rejected.',
              }).then(() => {
                this.loadAccommodations();
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error Rejecting Accommodation',
                text: `An error occurred: ${error.message}`,
              });
            }
        );
  }
}
