import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Amenity } from '../model/enum/amenity.enum';
import { AccommodationType } from '../model/enum/accommodationType.enum';
import { PriceChange } from '../model/priceChange.model';
import { CalendarComponent } from 'src/app/shared/calendar/calendar.component';

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
  perNightChecked: boolean = false;
  perGuestChecked: boolean = false;
  defaultPrice: number = 0;
  minimumPrice: number | undefined;
  maximumPrice: number | undefined;
  description: string | undefined;
  name: string | undefined;
  addressStreet: string | undefined;
  streetNumber: number | undefined;
  city: string | undefined;
  postalCode: number | undefined;
  country: string | undefined;
  customPricesInput: { [date: string]: number } = { };
  
  customPrice: number = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    const amenityValues = Object.values(Amenity) as string[];
    for (const amenity of amenityValues) {
      this.amenitiesList.push(this.transformEnumToDisplayFormat(amenity));
    }
    const accTypeValues = Object.values(AccommodationType) as string[];
    for (const type of accTypeValues) {
      this.accTypeList.push(this.transformEnumToDisplayFormat(type));
    }
  }

  handlePerNightChange() {
    if (this.perNightChecked) {
      this.perGuestChecked = false;
    }
  }

  handlePerGuestChange() {
    if (this.perGuestChecked) {
      this.perNightChecked = false;
    }
  }

  handleAccTypeChange(selectedAccType: string): void {
    // Uncheck all other checkboxes
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
  
  applyCustomPrice(): void{
    const selectedRange = this.calendarComponent?.getSelectedRange();
    if (
      selectedRange != null &&
      selectedRange.start != null &&
      selectedRange.start !== undefined
    ) {
      this.customPricesInput[selectedRange.start] = this.customPrice;
    }
  }

  saveAccommodation():void{

  }
}