import { Component, OnInit, ViewChild  } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../model/accommodation.model';
import { Observable, map } from 'rxjs';
import { Photo } from 'src/app/shared/model/photo.model';
import { CalendarComponent } from 'src/app/shared/calendar/calendar.component';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from 'src/app/user/user.service';
import { differenceInDays } from 'date-fns';

@Component({
  selector: 'app-accommodation-details',
  templateUrl: './accommodation-details.component.html',
  styleUrls: ['./accommodation-details.component.css'],
})
export class AccommodationDetailsComponent implements OnInit {
  @ViewChild('calendarRef') calendarComponent: CalendarComponent | undefined;
  pictureUrls: string[] = [];
  accommodationId: number = 1;
  accommodation: Observable<Accommodation> = new Observable<Accommodation>();
  selectedClass: string = 'bar-text';
  currentIndex: number = 0;
  startDate: string | null = null;
  endDate: string | null = null;
  role: string = '';
  totalPrice: number = 0;
  numberGuests: number = 0;
  days: number = 0;
  location: string = "";
  accommodations: Accommodation[] = [];
  foundAccommodation!: Accommodation;
  constructor( private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService, private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    console.log(this.role);
    
    this.route.params.subscribe((params) => {
      this.accommodationId = params['id'];
      this.route.queryParams.subscribe(queryParams => {
        this.startDate = queryParams['startDate'];
        this.endDate = queryParams['endDate'];
        this.totalPrice = queryParams['totalPrice'];
        this.numberGuests = queryParams['numberGuests'];
        this.days = queryParams['days'];
      });
    });

    this.authService.userState.subscribe((result) => {
      this.role = result;
    })

    

    this.accommodation = this.accommodationService.getAccommodationById(this.accommodationId);


    this.getUrls().subscribe((urls) => {
      this.pictureUrls = urls;
    });

  }

  handleCalendarClick(event: any) {
    if (this.calendarComponent) {
      const selectedRange = this.calendarComponent.getSelectedRange();
      let start: Date = new Date();
      let end: Date = new Date();
      if (selectedRange.start){
        start = new Date(selectedRange.start);
      }
      if (selectedRange.end){
        end = new Date(selectedRange.end)
      }
      if(selectedRange.hasAlreadyPicked == false){
        this.days = differenceInDays(end, start);
        this.accommodation.subscribe((data: Accommodation) => {
          this.location = data.address.country;
        });
        this.accommodationService.searchAccommodations(this.location, this.numberGuests , start, end, [], 0.0, 0.0, 0.0, null, "")
          .subscribe((filterResults: Accommodation[]) => {
            // console.log('Accommodations:', filterResults);
            this.accommodations = filterResults;
            console.log("IDDDDD" + this.accommodationId)
            const foundAccommodation = this.findAccommodationById(this.accommodations, this.accommodationId);

            console.log(foundAccommodation);
            if(foundAccommodation){
              this.foundAccommodation = foundAccommodation;
              console.log("TOTAAAAAAAAAL "  + this.foundAccommodation.totalPrice);
              this.totalPrice = this.foundAccommodation.totalPrice;
            }
          }
        )
      } 
     
    }
    
  }
  
  findAccommodationById(accommodations: Accommodation[], targetId: number): Accommodation | undefined {
    console.log(targetId);
    for (const accommodation of accommodations) {
      console.log(accommodation.id);
      if (accommodation.id == targetId) {
        return accommodation;
      }
    }
    return undefined; 
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


  onButtonClick(): void {
    if (this.calendarComponent) {
      const selectedRange = this.calendarComponent.getSelectedRange();
      if(selectedRange.hasAlreadyPicked == false){
        console.log("Successfully select range.", selectedRange);
        this.router.navigate(['/create-reservation', this.accommodationId], { queryParams: { startDate: selectedRange.start, endDate: selectedRange.end, totalPrice: this.totalPrice, numberGuests: this.numberGuests, days: this.days} })
      }else{
        console.log('You can not select this range, some dates are already reserved.', selectedRange);
      }
    }
  }
}
