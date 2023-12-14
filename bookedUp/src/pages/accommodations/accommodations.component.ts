import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from '../../app/core/services/accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../../app/core/model/Accommodation';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css', '../../styles.css']
})
export class AccommodationsComponent implements OnInit {

  accommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
  selectedClass: string = 'active-accommodations';
  filter: string = 'active';
  constructor(private accommodationService: AccommodationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'active';
      this.loadAccommodations();
    });

    var newAcc = document.getElementById("new-acc");
      if (newAcc) {
        newAcc.addEventListener("click", () => {
          this.router.navigate(['/add-new-accommodation'], );
      });
    }
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/accommodation-details', id]);
  }

    private loadAccommodations(): void {
        if (this.filter === 'active') {
            this.accommodations = this.accommodationService.getAllActiveAccommodationsByHostId(2);
        } else if (this.filter === 'requests') {
            this.accommodations = this.accommodationService.getAllRequestsByHostId(2);
        } else {
            this.accommodations = this.accommodationService.getAllRejectedByHostId(2);

        }
    }

    changeStyle(className: string): void {
        this.selectedClass = className;
        if (className === 'active-accommodations') {
            this.router.navigate(['/accommodations'], { queryParams: { filter: 'active' } });
        } else if (className === 'requests-accommodations') {
            this.router.navigate(['/accommodations'], { queryParams: { filter: 'requests' } });
        } else {
            this.router.navigate(['/accommodations'], { queryParams: { filter: 'rejected' } });
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
