import {Component, Host, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Amenity} from '../model/enum/amenity.enum';
import {AccommodationType} from '../model/enum/accommodationType.enum';
import {CalendarComponent} from 'src/app/shared/calendar/calendar.component';
import {Accommodation} from "../model/accommodation.model";
import {PriceType} from "../model/enum/priceType.enum";
import {AccommodationStatus} from "../model/enum/accommodationStatus.enum";
import {AuthService} from "../../infrastructure/auth/auth.service";
import {HostService} from "../../user/host/host.service";
import {AccommodationService} from "../accommodation.service";
import Swal from "sweetalert2";
import { ChangeDetectorRef } from '@angular/core';
import {DateRange} from "../model/dateRange.model";
import {PriceChange} from "../model/priceChange.model";


@Component({
  selector: 'app-create-accommodation',
  templateUrl: './create-accommodation.component.html',
  styleUrls: ['./create-accommodation.component.css', '../../../styles.css']
})
export class CreateAccommodationComponent implements OnInit {
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

  customPrice: number = 0;

  priceType: PriceType = PriceType.PerNight;
  accType: AccommodationType = AccommodationType.Apartment;
  accAmenities: Amenity[] = [];
  accPriceChange: PriceChange[] = [];

  loggedUser!: Host;

  addedDates: { start: string, end: string }[] = [];
  availability: DateRange[] = [];


  constructor(private router: Router, private hostService: HostService, private authService: AuthService, private accommodationService: AccommodationService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const amenityValues = Object.values(Amenity) as string[];
    for (const amenity of amenityValues) {
      this.amenitiesList.push(this.transformEnumToDisplayFormat(amenity));
    }
    const accTypeValues = Object.values(AccommodationType) as string[];
    for (const type of accTypeValues) {
      this.accTypeList.push(this.transformEnumToDisplayFormat(type));
    }

    this.hostService.getHost(this.authService.getUserID()).subscribe(
        (host: Host) => {
          this.loggedUser = host;
        },
        (error) => {
          console.error('Error loading user:', error);
        }
    );
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


  saveAccommodation(): void {

    console.log(this.acceptReservations);
    if(this.validation()){
      const accommodation: Accommodation = {
        name: this.name || '',
        description: this.description || '',
        address: {
          country: this.country || '',
          city: this.city || '',
          postalCode: this.postalCode || '',
          streetAndNumber: this.addressStreet || '',
          latitude: 0, //??
          longitude: 0 //??
        },
        amenities: this.accAmenities,
        photos: [], //??
        minGuests: this.minimumPrice || 0,
        maxGuests: this.maximumPrice || 0,
        type: this.accType,
        availability: this.availability = this.addedDates.map(addedDate => ({
          startDate: new Date(addedDate.start),
          endDate: new Date(addedDate.end),
        })),
        priceType: this.priceType,
        priceChanges: [],//
        automaticReservationAcceptance: this.acceptReservations,
        status: AccommodationStatus.Created,
        host: this.loggedUser,
        price: this.defaultPrice,
        cancellationDeadline: 10, //videcemo
      };

      Swal.fire({icon: 'success', title: 'Accommodation created successfully!', text: 'You will be redirected to the home page.',}).then(() => {
                 //this.router.navigate(['/']);
               });

      // this.accommodationService.createAccommodation(accommodation).subscribe(
      //     (createdAccommodation: Accommodation) => {
      //       Swal.fire({icon: 'success', title: 'Accommodation created successfully!', text: 'You will be redirected to the home page.',}).then(() => {
      //         this.router.navigate(['/']);
      //       });        },
      //     (error) => {
      //       Swal.fire({icon: 'error', title: 'Error creating accommodation', text: 'Please try again.',});
      //     }
      // );

    }

  }

  private validation(){
    if (!this.name || !this.description || !this.addressStreet || !this.city || !this.postalCode || !this.country ||
        this.name.trim() === '' || this.description.trim() === '' || this.addressStreet.trim() === '' || this.city.trim() === '' || this.postalCode.trim() === '' || this.country.trim() === '' ||
        this.defaultPrice <= 0 ||
        (this.minimumPrice !== undefined && (this.minimumPrice <= 0 ||
        (this.maximumPrice !== undefined && this.minimumPrice > this.maximumPrice))) ||
        (this.maximumPrice !== undefined && this.maximumPrice <= 0) ||
        Object.values(this.accTypeChecked).every(value => value === false)) {
      Swal.fire({
      icon: 'error',
      title: 'Invalid Input',
      text: 'All properties must have a valid value. Please check and enter valid information for all fields.',
    });
      return false;
    }
    return true;
  }

  toggleAmenity(amenity: string): void {
    const amenityEnum = Amenity[amenity as keyof typeof Amenity];
    if (this.accAmenities.includes(amenityEnum)) {
      this.accAmenities = this.accAmenities.filter(a => a !== amenityEnum);
    } else {
      this.accAmenities.push(amenityEnum);
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
