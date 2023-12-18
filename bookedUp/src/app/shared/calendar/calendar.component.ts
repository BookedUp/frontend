// src/app/calendar/calendar.component.ts

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { DateRange } from 'src/app/accommodation/model/dateRange.model';
import { PriceChange } from 'src/app/accommodation/model/priceChange.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../styles.css'],
})

export class CalendarComponent implements OnChanges {
  @Input() defaultPrice: number = 0;
  @Input() customPricesInput: PriceChange[] | null = [];
  customPrices: { [date: string]: number } = { };
  @Input() alreadyPickedInput: DateRange[] | null = [];
  alreadyPicked: { [date: string]: string } = { };
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  selectedRange: { start: number | null; startMonth: number | null; startYear: number | null; end: number | null ; endMonth: number | null; endYear: number | null; } = { start: null, startMonth: null, startYear: null, end: null, endMonth: null, endYear: null };

  displayedMonth: number;
  displayedYear: number;

  // Initialize calendarDates with the days of the selected month
  calendarDates: { day: number; month: number; year:number; price: number; selected: boolean }[] = [];

  constructor(private accommodationService: AccommodationService) {
    const currentDate = new Date();
    this.displayedMonth = currentDate.getMonth() + 1; // Months are zero-based
    this.displayedYear = currentDate.getFullYear();
    this.generateCalendar();
  }

  ngOnInit(){
    if(this.startDate != null && this.endDate != null){

      const parsedDateStart = new Date(this.startDate);
      const parsedDateEnd = new Date(this.endDate);

      // Extract year, month, and day
      const yearStart = parsedDateStart.getFullYear();
      const monthStart = parsedDateStart.getMonth() + 1; // Months are zero-indexed, so add 1
      const dayStart = parsedDateStart.getDate();

      const yearEnd = parsedDateEnd.getFullYear();
      const monthEnd = parsedDateEnd.getMonth() + 1;
      const dayEnd = parsedDateEnd.getDate();
      
      this.displayedYear = yearStart;
      this.displayedMonth = monthStart;

      this.selectedRange.start = dayStart;
      this.selectedRange.startMonth = monthStart;
      this.selectedRange.startYear = yearStart;
      this.selectedRange.end = dayEnd;
      this.selectedRange.endMonth = monthEnd;
      this.selectedRange.endYear = yearEnd;
    }
    if(this.customPricesInput != null){
      this.customPrices = this.getCustom(this.customPricesInput);
    }
    if(this.alreadyPickedInput != null){
      console.log("ovo je input", this.alreadyPickedInput);
      this.alreadyPicked = this.getAlreadyPicked(this.alreadyPickedInput);
      console.log("ovo je posle funkcije", this.alreadyPicked);
    }
    this.generateCalendar();
  }

  getCustom(priceList: PriceChange[]): { [date: string]: number } {
    var customPrices: { [date: string]: number } = {};
  
    for (var i = 0; i < priceList.length; i++) {
      var priceChange = priceList[i];
      var dateString: string = priceChange.changeDate.toString().split('T')[0];
      var nextDateString: string | undefined;
  
      if (i < priceList.length - 1) {
        nextDateString = priceList[i + 1].changeDate.toString().split('T')[0];
      }
  
      customPrices[dateString] = priceChange.newPrice;
  
      // Fill in intermediate dates within the range
      if (nextDateString) {
        var currentDate = new Date(dateString);
        var nextDate = new Date(nextDateString);
  
        while (currentDate < nextDate) {
          currentDate.setDate(currentDate.getDate() + 1);
          customPrices[currentDate.toISOString().split('T')[0]] = priceChange.newPrice;
        }
      }
  
      // If it's the last date, extend for an additional 30 days with the last known price
      if (i === priceList.length - 1) {
        var lastDate = new Date(dateString);
        for (var j = 0; j < 30; j++) {
          lastDate.setDate(lastDate.getDate() + 1);
          customPrices[lastDate.toISOString().split('T')[0]] = priceChange.newPrice;
        }
      }
    }
  
    return customPrices;
  }
  
  getAlreadyPicked(dateRanges: DateRange[]): { [date: string]: string } {
    var alreadyPicked: { [date: string]: string } = {};
  
    dateRanges.forEach((range) => {
      var fromDate: string = range.startDate.toString().split('T')[0];
      var toDate: string = range.endDate.toString().split('T')[0];
      alreadyPicked[fromDate] = toDate;
    });
  
    return alreadyPicked;
  }
  
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultPrice'] && !changes['defaultPrice'].firstChange) {
      this.generateCalendar();
    }
  }

  handleDateClick(day: number): void {
    if (this.selectedRange.start === null) {
      // Selecting the start of the range
      this.selectedRange.start = day;
      this.selectedRange.end = null;
    } else if (day < this.selectedRange.start) {
      // Selecting a new start of the range
      this.selectedRange.start = day;
      this.selectedRange.end = null;
    } else if (day > this.selectedRange.start) {
      // Selecting the end of the range
      this.selectedRange.end = day;
    } else {
      // Deselecting the start of the range
      this.selectedRange.start = null;
      this.selectedRange.end = null;
    }

    this.updateSelectedStyles();
  }
  // Generate the calendar for the selected month and year
  generateCalendar(): void {  
    const firstDay = new Date(this.displayedYear, this.displayedMonth - 1, 1).getDay(); // 0-indexed
    const daysInMonth = new Date(this.displayedYear, this.displayedMonth, 0).getDate();
  
    this.calendarDates = [];
  
    // Fill in the days before the 1st day of the month with a placeholder
    for (let i = 0; i < firstDay; i++) {
      this.calendarDates.push({ day: 0, month: 0, year: 0, price: 0, selected: false });
    }
  
    // Fill in the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${this.displayedYear}-${this.displayedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      this.calendarDates.push({
        day,
        month: this.displayedMonth,
        year: this.displayedYear,
        price: this.customPrices[dateKey] !== undefined ? this.customPrices[dateKey] : this.defaultPrice,
        selected: false,
      });
    }
  
    this.updateSelectedStyles();
  }
  

  updateDefaultPrice(newDefaultPrice: number, changeDate: string): void {
  
    // Update the default price for the specific date change
    this.customPrices[changeDate] = newDefaultPrice;
  
    // Update default price for all subsequent dates
    let foundChangeDate = false;
    for (const dateKey in this.customPrices) {
      if (foundChangeDate) {
        this.customPrices[dateKey] = newDefaultPrice;
      }
  
      if (dateKey === changeDate) {
        foundChangeDate = true;
      }
    }
  }


  // Change the selected month and update the calendar
  changeMonth(delta: number): void {
    this.displayedMonth += delta;
    if (this.displayedMonth === 0) {
      this.displayedMonth = 12;
      this.displayedYear--;
    } else if (this.displayedMonth === 13) {
      this.displayedMonth = 1;
      this.displayedYear++;
    }
    this.generateCalendar();
  }

  // Change the selected year and update the calendar
  changeYear(delta: number): void {
    this.displayedYear += delta;
    this.generateCalendar();
  }

  // Get the name of the month based on its number (1-indexed)
  getMonthName(monthNumber: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  }

  // Update the selected styles based on the selected range
  updateSelectedStyles(): void {
    this.calendarDates.forEach((date) => {
      if (this.selectedRange.start !== null && (date.day === this.selectedRange.start || (this.selectedRange.end !== null && date.day > this.selectedRange.start && date.day <= this.selectedRange.end)) &&
          (this.selectedRange.startMonth !== null && (this.displayedMonth === this.selectedRange.startMonth || (this.selectedRange.endMonth !== null && this.selectedRange.endMonth == this.displayedMonth))) &&
          (this.selectedRange.startYear !== null && (this.displayedYear === this.selectedRange.startYear || (this.selectedRange.endYear !== null && this.selectedRange.endYear == this.displayedYear)))
        ) {
        date.selected = true;
      } else {
        date.selected = false;
      }
    });
  }

  // Get the abbreviated day name based on the day index (0-based)
  getDayAbbreviation(dayIndex: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  }

  isDateAlreadyPicked(day: { day: number }): boolean {
    if(day.day != 0){
      const dateKey = this.getDateKey(day);
  
      // Check if the date falls within any already picked range
      return Object.entries(this.alreadyPicked).some(([start, end]) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const currentDate = new Date(dateKey);
    
        return currentDate >= startDate && currentDate <= endDate;
      });
    }else{
      return true;
    }
    
  }
  getDateKey(day: { day: number }): string {
    return `${this.displayedYear}-${this.displayedMonth.toString().padStart(2, '0')}-${day.day.toString().padStart(2, '0')}`;
  }
    
  getSelectedRange(): { start: string | null; end: string | null; hasAlreadyPicked: boolean } {
    if (this.selectedRange.start !== null && this.selectedRange.end !== null) {
      const startKey = this.getDateKey({ day: this.selectedRange.start });
      const endKey = this.getDateKey({ day: this.selectedRange.end });
  
      // Check if there are already picked dates within the selected range
      const hasAlreadyPicked = Object.entries(this.alreadyPicked).some(([start, end]) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const selectedStartDate = new Date(startKey);
        const selectedEndDate = new Date(endKey);
  
        // Proveri da li se izabrani opseg nalazi unutar opsega iz this.alreadyPicked
        return (
          (selectedStartDate >= startDate && selectedEndDate <= endDate) ||
          (selectedStartDate <= startDate && selectedEndDate >= endDate)
        );
      });
  
      return { start: startKey, end: endKey, hasAlreadyPicked: !hasAlreadyPicked };
    } else {
      return { start: null, end: null, hasAlreadyPicked: true };
    }
  }
  
  
  
}