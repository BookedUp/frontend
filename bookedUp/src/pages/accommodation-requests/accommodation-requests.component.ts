import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from '../../app/core/services/accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../../app/core/model/Accommodation';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accommodation-requests',
  templateUrl: './accommodation-requests.component.html',
  styleUrls: ['./accommodation-requests.component.css', '../../styles.css']
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

  approveAccommodation(accommodation: Accommodation) {
    this.accommodationService.approveAccommodation(accommodation.id);

  }

  rejectAccommodation(accommodation: Accommodation) {
    this.accommodationService.rejectAccommodation(accommodation.id)
  }
}
