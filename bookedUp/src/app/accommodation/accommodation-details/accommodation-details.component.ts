import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../model/accommodation.model';
import { Observable, map } from 'rxjs';
import { Photo } from 'src/app/shared/model/photo.model';

@Component({
  selector: 'app-accommodation-details',
  templateUrl: './accommodation-details.component.html',
  styleUrls: ['./accommodation-details.component.css'],
})
export class AccommodationDetailsComponent implements OnInit {
  pictureUrls: string[] = [];
  accommodationId: number = 1;
  accommodation: Observable<Accommodation> = new Observable<Accommodation>();
  selectedClass: string = 'bar-text';
  currentIndex: number = 0;

  constructor( private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accommodationId = params['id'];
    });
    this.accommodation = this.accommodationService.getAccommodationById(this.accommodationId);
    
    this.accommodation.subscribe((data) => {
      console.log(data);
      // You can perform further actions with the data here
    });
    this.getUrls().subscribe((urls) => {
      this.pictureUrls = urls;
    });
  }

  getUrls(): Observable<string[]> {
    return this.accommodation.pipe(
      map((accommodation: { photos: Photo[]; }) => accommodation?.photos?.map((photo) => photo.url) || [])
    );
  }

  nextImage() {
    if (this.currentIndex < this.pictureUrls.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    if (className === 'bar-text-review') {
      this.router.navigate(['/accommodation-details'], { queryParams: { filter: 'review' } });
    } else {
      this.router.navigate(['/accommodation-details'], { queryParams: { filter: 'overview' } });
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
}
