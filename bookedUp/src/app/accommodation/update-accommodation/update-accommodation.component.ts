import {ChangeDetectorRef, Component, Host, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from "../../shared/calendar/calendar.component";
import {PriceType} from "../model/enum/priceType.enum";
import {AccommodationType} from "../model/enum/accommodationType.enum";
import {Amenity} from "../model/enum/amenity.enum";
import {PriceChange} from "../model/priceChange.model";
import {DateRange} from "../model/dateRange.model";
import {ActivatedRoute, Router} from "@angular/router";
import {HostService} from "../../user/host/host.service";
import {AuthService} from "../../infrastructure/auth/auth.service";
import {AccommodationService} from "../accommodation.service";
import {Accommodation} from "../model/accommodation.model";
import {AccommodationStatus} from "../model/enum/accommodationStatus.enum";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Observable, map } from 'rxjs';
import { Photo } from 'src/app/shared/model/photo.model';

@Component({
  selector: 'app-update-accommodation',
  templateUrl: './update-accommodation.component.html',
  styleUrls: ['./update-accommodation.component.css']
})
export class UpdateAccommodationComponent implements OnInit {
  @ViewChild('calendarRef') calendarComponent: CalendarComponent | undefined;
  amenitiesList : string[] = [];
  accTypeList : string[] = [];
  accTypeChecked: { [key: string]: boolean } = {};
  perNightChecked: boolean = true;
  perGuestChecked: boolean = false;
  defaultPrice: number = 0;
  minimumPrice: number | undefined;
  maximumPrice: number | undefined;
  description: string | undefined;
  name: string | undefined;
  addressStreet: string | undefined;
  city: string | undefined;
  postalCode: string | undefined;
  country: string | undefined;
  acceptReservations: boolean = false;
  isInputReadOnly: boolean = false;
  pictureUrls: string[] = [];
  currentIndex: number = 0;


  customPricesInput: { [date: string]: number } = { };
  customPrice: number = 0;

  priceType: PriceType = PriceType.PerNight;
  accType: AccommodationType = AccommodationType.Apartment;
  accAmenities: Amenity[] = [];
  accPriceChange: PriceChange[] = [];

  loggedUser!: Host;

  addedDates: { start: string, end: string }[] = [];
  availability: DateRange[] = [];

  //
  accommodation: Observable<Accommodation> = new Observable<Accommodation>();
  selectedAccommodation!: Accommodation;
  selectedAccommodationId: number = 0;

  updateForm: FormGroup | undefined;

  constructor(private router: Router,  private route: ActivatedRoute,private hostService: HostService, private authService: AuthService, private accommodationService: AccommodationService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      streetAndNumber: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      defaultPrice: [0, Validators.required],
      perNightChecked: [true],
      perGuestChecked: [false],
      description: ['', Validators.required],
      minimumGuest: [0, Validators.required],
      maximumGuest: [0, Validators.required],
      acceptReservations: [false],
    });
  }

  ngOnInit() {
    const amenityValues = Object.values(Amenity) as string[];
    for (const amenity of amenityValues) {
      this.amenitiesList.push(this.transformEnumToDisplayFormat(amenity));
    }
    const accTypeValues = Object.values(AccommodationType) as string[];
    for (const type of accTypeValues) {
      this.accTypeList.push(this.transformEnumToDisplayFormat(type));
    }

    

    this.route.params.subscribe((params) => {
      this.selectedAccommodationId = params['id'];

      this.accommodation = this.accommodationService.getAccommodationById(this.selectedAccommodationId);
      this.accommodationService.getAccommodationById(this.selectedAccommodationId).subscribe(
          (acc: Accommodation) => {
            this.selectedAccommodation = acc;

            if(acc.priceType == PriceType.PerGuest){
              this.perGuestChecked = true;
              this.perNightChecked = false;
            }else{
              this.perNightChecked = true;
              this.perGuestChecked = false;
            }
            
            this.availability = acc.availability;
            this.defaultPrice = acc.price;
            this.accPriceChange = acc.priceChanges;

            this.updateForm!.setValue({
              name: acc.name,
              streetAndNumber: acc.address.streetAndNumber,
              city: acc.address.city,
              postalCode: acc.address.postalCode,
              country: acc.address.country,
              defaultPrice: acc.price,
              perNightChecked: this.perNightChecked,
              perGuestChecked: this.perGuestChecked,
              description: acc.description,
              minimumGuest: acc.minGuests,
              maximumGuest: acc.maxGuests,
              acceptReservations: acc.automaticReservationAcceptance,
            });
          },
          (error) => {console.error('Error loading user:', error);
          });


      this.hostService.getHost(this.authService.getUserID()).subscribe(
          (host: Host) => {
            this.loggedUser = host;
          },
          (error) => {
            console.error('Error loading user:', error);
          }
      );
    });

    this.getUrls().subscribe((urls) => {
      this.pictureUrls = urls;
    });
  }

  

  handlePerNightChange() {
    if (this.perNightChecked) {
      this.perGuestChecked = false;
      this.priceType = PriceType.PerNight;
    }
  }

  handlePerGuestChange() {
    if (this.perGuestChecked) {
      this.perNightChecked = false;
      this.priceType = PriceType.PerGuest;
    }
  }

  handleAccTypeChange(selectedAccType: string): void {
    this.accType = AccommodationType[selectedAccType as keyof typeof AccommodationType];
    Object.keys(this.accTypeChecked).forEach(accType => {
      if (accType !== selectedAccType) {
        this.accTypeChecked[accType] = false;
      }
    });
  }

  transformEnumToDisplayFormat(enumValue: string): string {
    const words = enumValue.split('_');
    const formattedString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    return formattedString;
  }


  applyCustomPrice(): void {
    if(this.isInputReadOnly == false){
      Swal.fire({
        title: 'Default Price Changed!',
        text: 'You can no longer change it in this window.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          if(this.defaultPrice != 0){
            this.isInputReadOnly = true;
            const selectedRange = this.calendarComponent?.getSelectedRange();
            if (selectedRange != null && selectedRange.start != null && selectedRange.start !== undefined && selectedRange.end != null && selectedRange.end !== undefined) {
              
              const startDate = new Date(selectedRange.start);
              const endDate = new Date(selectedRange.end);
      
              const newPriceChangeStart: PriceChange = {
                changeDate: startDate,
                newPrice: this.customPrice,
              };
      
              this.accPriceChange = [...this.accPriceChange, newPriceChangeStart];
      
      
              var lastDate = new Date(selectedRange.end);
              lastDate.setDate(lastDate.getDate() + 1);
              const newPriceChange: PriceChange = {
                changeDate: lastDate,
                newPrice: this.defaultPrice,
              };
        
              this.accPriceChange = [...this.accPriceChange, newPriceChange];
          }
          }else{
            alert("You didn't input default price. Please provide a default price before entering a custom one.");
            return;
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          return;
        }
      });
    }else{
      if(this.defaultPrice != 0){
        this.isInputReadOnly = true;
        const selectedRange = this.calendarComponent?.getSelectedRange();
        if (selectedRange != null && selectedRange.start != null && selectedRange.start !== undefined && selectedRange.end != null && selectedRange.end !== undefined) {
          
          const startDate = new Date(selectedRange.start);
          const endDate = new Date(selectedRange.end);
  
          const newPriceChangeStart: PriceChange = {
            changeDate: startDate,
            newPrice: this.customPrice,
          };
  
          this.accPriceChange = [...this.accPriceChange, newPriceChangeStart];
  
  
          var lastDate = new Date(selectedRange.end);
          lastDate.setDate(lastDate.getDate() + 1);
          const newPriceChange: PriceChange = {
            changeDate: lastDate,
            newPrice: this.defaultPrice,
          };
    
          this.accPriceChange = [...this.accPriceChange, newPriceChange];
      }
      }else{
        alert("You didn't input default price. Please provide a default price before entering a custom one.");
        return;
      }
    }
    

    
  }



addDateRange() {
  const selectedDates = this.calendarComponent?.getSelectedRange();

  if (selectedDates?.start !== null && selectedDates?.end !== null && selectedDates?.hasAlreadyPicked) {
    this.addedDates.push({ start: selectedDates.start, end: selectedDates.end });
    this.addedDates = this.mergeOverlappingDateRanges(this.addedDates);

    if (this.calendarComponent?.selectedRange) {
      this.calendarComponent.selectedRange.start = null;
      this.calendarComponent.selectedRange.end = null;
    }

    this.calendarComponent?.generateCalendar();
  } else {
    alert('Please select valid date range!');
  }
}

private mergeOverlappingDateRanges(dateRanges: { start: string, end: string }[]): { start: string, end: string }[] {
  dateRanges.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const mergedRanges: { start: string, end: string }[] = [];
  let currentRange = dateRanges[0];
  for (let i = 1; i < dateRanges.length; i++) {
    const nextRange = dateRanges[i];

    const currentStartDate = new Date(currentRange.start);
    const currentEndDate = new Date(currentRange.end);
    const nextStartDate = new Date(nextRange.start);
    const nextEndDate = new Date(nextRange.end);


    if (currentEndDate >= nextStartDate) {
      if(currentEndDate >= nextEndDate){
        continue;
      }else{
        currentRange.end = nextRange.end;
      }
    } else {
      mergedRanges.push(currentRange);
      currentRange = nextRange;
    }
  }

  mergedRanges.push(currentRange);

  return mergedRanges;
}


deleteDateRange(): void {
  const selectedDates = this.calendarComponent?.getSelectedRange();

  if (selectedDates?.start && selectedDates?.end) {
    const startSelectedDate = new Date(selectedDates.start);
    const endSelectedDate = new Date(selectedDates.end);

    this.addedDates.forEach((dateRange, index) => {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      if (endSelectedDate < startDate || startSelectedDate > endDate) {
        // No overlap, do nothing
      } else if (startSelectedDate <= startDate && endSelectedDate >= endDate) {
        // Selected range completely covers the current range, remove it
        this.addedDates.splice(index, 1);
      } else if (startSelectedDate <= startDate && endSelectedDate < endDate) {
        // Overlapping on the left side, adjust start date
        dateRange.start = endSelectedDate.toISOString().split('T')[0];
      } else if (startSelectedDate > startDate && endSelectedDate >= endDate) {
        // Overlapping on the right side, adjust end date
        dateRange.end = startSelectedDate.toISOString().split('T')[0];
      } else if (startSelectedDate > startDate && endSelectedDate < endDate) {
        // Selected range is in the middle, split the current range
        const newEndDate = endSelectedDate.toISOString().split('T')[0];
        dateRange.end = startSelectedDate.toISOString().split('T')[0];

        // Insert a new range for the right side
        this.addedDates.splice(index + 1, 0, {
          start: newEndDate,
          end: endDate.toISOString().split('T')[0]
        });
      }
    });

    this.addedDates = this.mergeOverlappingDateRanges(this.addedDates);
  }
}
nextImage() {
  if (this.currentIndex < this.pictureUrls.length - 1) {
    this.currentIndex++;
  } else {
    this.currentIndex = 0;
  }
}

getUrls(): Observable<string[]> {
  return this.accommodation.pipe(
    map((accommodation: { photos: Photo[]; }) => accommodation?.photos?.map((photo) => photo.url) || [])
  );
}

uploadNewImage(): void {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
}

handleFileInputChange(event: Event): void {
  const inputElement = event.target as HTMLInputElement;

  if (inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0];

    const imageUrl = URL.createObjectURL(file);

    this.pictureUrls.push(imageUrl);

    inputElement.value = '';
  }
  console.log("ovo je posle dodavanja ", this.pictureUrls);
}

deleteImage():void{
  if (this.currentIndex >= 0 && this.currentIndex < this.pictureUrls.length) {
    this.pictureUrls.splice(this.currentIndex, 1);
    if (this.currentIndex >= this.pictureUrls.length) {
      this.currentIndex = this.pictureUrls.length - 1;
    }
  } else {
    console.error('Invalid currentIndex value');
  }
  console.log("ovo je posle brisanja ", this.pictureUrls);
}

private subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

}
