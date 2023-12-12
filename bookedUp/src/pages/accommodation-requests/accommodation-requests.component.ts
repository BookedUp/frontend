import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from '../../app/core/services/accommodation.service';
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
  constructor(private accommodationService: AccommodationService) { }

  ngOnInit(): void {
    this.colorAccommodationFrame();
    this.accommodations = this.accommodationService.getAllModifiedAccommodations();
  }

  private colorAccommodationFrame(){

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

  changeStyle(className: string): void {
    this.selectedClass = className;
  }
}
