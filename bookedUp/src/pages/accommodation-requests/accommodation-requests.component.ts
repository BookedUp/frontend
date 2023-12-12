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
  stars: string[] = [];
  accommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
  
  constructor(private accommodationService: AccommodationService) { }

  ngOnInit(): void {
    this.colorAccommodationFrame();
    this.accommodations = this.accommodationService.getAllModifiedAccommodations();
    //this.generateStars();
    console.log("accommodations, ", this.accommodations);
  
  }

  private colorAccommodationFrame(){

  }

  private generateStars() {
    const ratingElement = document.getElementById("reviews-average");
    const rating = parseFloat(ratingElement!.innerText);
    console.log(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        this.stars.push('★');
      } else if (i - 0.5 === rating) {
        this.stars.push('✯');
      } else {
        this.stars.push('☆');
      }
    }
  }
}
