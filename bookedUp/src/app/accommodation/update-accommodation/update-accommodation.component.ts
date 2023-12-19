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

      this.accommodationService.getAccommodationById(this.selectedAccommodationId).subscribe(
          (acc: Accommodation) => {
            this.selectedAccommodation = acc;

            this.updateForm!.setValue({
              name: acc.name,
              streetAndNumber: acc.address.streetAndNumber,
              city: acc.address.city,
              postalCode: acc.address.postalCode,
              country: acc.address.country,
              defaultPrice: acc.price,
              perNightChecked: [true],
              perGuestChecked: [false],
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
    const selectedRange = this.calendarComponent?.getSelectedRange();

    if (selectedRange != null && selectedRange.start != null && selectedRange.start !== undefined) {
    const newPriceChange: PriceChange = {
      changeDate: new Date(selectedRange.start),
      newPrice: this.customPrice,
    };

    // Dodajte novi PriceChange u customPricesInput
    this.accPriceChange.push(newPriceChange);

    console.log(this.accPriceChange);
    this.calendarComponent?.generateCalendar();
  }
}



  addDateRange() {
    const selectedDates = this.calendarComponent?.getSelectedRange();

    if (selectedDates?.start !== null && selectedDates?.end !== null && selectedDates?.hasAlreadyPicked) {
      this.addedDates.push({ start: selectedDates.start, end: selectedDates.end });

      console.log(this.addedDates);

      this.addedDates = this.mergeOverlappingDateRanges(this.addedDates);

      if (this.calendarComponent?.selectedRange) {
        this.calendarComponent.selectedRange.start = null;
        this.calendarComponent.selectedRange.end = null;
      }

      this.calendarComponent?.generateCalendar();
    } else {
      alert('Molimo vas da odaberete validan datumski opseg.');
    }
  }


private mergeOverlappingDateRanges(dateRanges: { start: string, end: string }[]): { start: string, end: string }[] {
    dateRanges.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const mergedRanges: { start: string, end: string }[] = [];
    let currentRange = dateRanges[0];

    for (let i = 1; i < dateRanges.length; i++) {
      const nextRange = dateRanges[i];

      const currentEndDate = new Date(currentRange.end);
      const nextStartDate = new Date(nextRange.start);

      if (currentEndDate >= nextStartDate || nextStartDate <= currentEndDate) {
        // Ranges overlap or touch, merge them
        currentRange.end = nextRange.end;
      } else if (nextRange.start >= currentRange.start && nextRange.end <= currentRange.end) {
        // Next range is completely within the current range, skip it
        continue;
      } else {
        // Ranges don't overlap and next range is not completely within the current range, add the current range to the result
        mergedRanges.push(currentRange);
        currentRange = nextRange;
      }

      console.log(dateRanges);

    }

    // Add the last range
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

      if (
          (startDate >= startSelectedDate && startDate <= endSelectedDate) ||
          (endDate >= startSelectedDate && endDate <= endSelectedDate) ||
          (startDate <= startSelectedDate && endDate >= endSelectedDate)
      ) {
        // Datum iz liste se preklapa sa odabranim opsegom, treba ga smanjiti
        if (startDate < startSelectedDate) {
          dateRange.end = this.subtractDays(startSelectedDate, 1).toISOString().split('T')[0];
        }

        if (endDate > endSelectedDate) {
          dateRange.start = this.addDays(endSelectedDate, 1).toISOString().split('T')[0];
        }
      }
    });

    // Ponovno spoji datume nakon brisanja
    this.addedDates = this.mergeOverlappingDateRanges(this.addedDates);

    // Ako želite ažurirati i kalendar, pozovite odgovarajuće metode
    // this.calendarComponent?.generateCalendar();
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
