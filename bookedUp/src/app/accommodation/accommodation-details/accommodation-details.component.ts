import { Component, OnInit, ViewChild  } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../model/accommodation.model';
import { Observable, map } from 'rxjs';
import { Photo } from 'src/app/shared/model/photo.model';
import { CalendarComponent } from 'src/app/shared/calendar/calendar.component';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from 'src/app/user/user.service';
import { DateRange } from '../model/dateRange.model';

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
        console.log(this.numberGuests);
        console.log(this.days);
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
        start = this.convertStringToDate(selectedRange.start);
      }
      if (selectedRange.end){
        end = this.convertStringToDate(selectedRange.end);
      }
      // console.log(selectedRange.start);
      // console.log(selectedRange.end);
      if(selectedRange.hasAlreadyPicked == false){
        console.log("puko");
        const newStartDate = this.calendarComponent.newStartDate ;
        let startDate : Date = new Date() ;
        if (newStartDate){
          startDate = this.convertStringToDate(newStartDate);
        }
        
        const newEndDate = this.calendarComponent.newEndDate;
        let endDate : Date = new Date();
        if (newEndDate){
          endDate = this.convertStringToDate(newEndDate);
        }
        
        // console.log("Accommodation details");
        // console.log("Startt " + startDate.toISOString());
        // console.log("Endd " + endDate.toISOString());
        // console.log(this.accommodationId);
        
        this.accommodation.subscribe((data: Accommodation) => {
          this.location = data.address.country;
        });
        this.accommodationService.searchAccommodations(this.location, this.numberGuests , startDate, endDate, [], 0.0, 0.0, 0.0, null, "")
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
      // console.log("ovde je")
      this.accommodation.subscribe((data: Accommodation) => {
        this.checkAvailability(data.availability, start, end);
      });
    }
    
  }
  
  findAccommodationById(accommodations: Accommodation[], targetId: number): Accommodation | undefined {
    console.log(targetId);
    for (const accommodation of accommodations) {
      console.log(accommodation.id);
      if (accommodation.id == targetId) {
        console.log("usao");
        return accommodation;
      }
    }
    return undefined; 
  }

  checkAvailability(availability: DateRange[], start: Date, end: Date) {
    console.log("tu sam");
  
    start.setHours(12, 0, 0, 0);
    end.setHours(12, 0, 0, 0);

    const formattedStart = start.toString();
    const formattedEnd = end.toString();

    const dateStart = this.convertToDate(formattedStart);
    const convertedStart = this.formatDateToISO(dateStart).substring(0,10);

    const dateEnd = this.convertToDate(formattedEnd);
    const convertedEnd = this.formatDateToISO(dateEnd).substring(0,10); 
  
    availability.forEach((dateRange: DateRange) => {
      const formattedDateRangeStart = dateRange.startDate.toString().substring(0,10);
      const formattedDateRangeEnd = dateRange.endDate.toString().substring(0, 10);
      // console.log("Start " + convertedStart)
      // console.log("End " + convertedEnd);
      // console.log("Date range Start " + formattedDateRangeStart);
      // console.log("Date range End " + formattedDateRangeEnd);
      const comparisonStartStart = this.compareDates(convertedStart, formattedDateRangeStart);
      // console.log("hh" + comparisonStartStart);
      const comparisonStartEnd = this.compareDates(convertedStart, formattedDateRangeEnd);
      // console.log("hh" + comparisonStartEnd);
      const comparisonEndEnd = this.compareDates(convertedEnd, formattedDateRangeEnd);
      // console.log("hh" + comparisonEndEnd);

      if (comparisonStartStart > 0 && comparisonStartEnd <= 0 && comparisonEndEnd > 0){
        alert("On the night " + formattedDateRangeEnd + " is cleaning time!");
        this.resetSelectedRange();
      }
    });
  }

  resetSelectedRange() {
    if (this.calendarComponent) {
      this.calendarComponent.selectedRange = {
        start: null,
        startMonth: null,
        startYear: null,
        end: null,
        endMonth: null,
        endYear: null
      };
    }
  }

  compareDates(dateString1: string, dateString2: string): number {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    if (date1 < date2) {
      return -1; // date1 < date2
    } else if (date1 > date2) {
      return 1; 
    } else {
      return 0; 
    }
  }

  convertToDate(inputString: string): Date {
    const date = new Date(inputString);
    return date;
  }
  
  formatDateToISO(date: Date): string {
    return date.toISOString();
  }

  convertStringToDate(dateString: string): Date{
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    const date = year !== undefined && month !== undefined && day !== undefined
        ? new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0)) 
        : new Date(); 
    return date;
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
        this.router.navigate(['/create-reservation', this.accommodationId], { queryParams: { startDate: selectedRange.start, endDate: selectedRange.end, totalPrice: this.totalPrice, numberGuests: this.numberGuests} })
      }else{
        console.log('You can not select this range, some dates are already reserved.', selectedRange);
      }
    }
  }
}
