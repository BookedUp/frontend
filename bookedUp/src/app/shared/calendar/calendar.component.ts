// src/app/calendar/calendar.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../styles.css'],
})

export class CalendarComponent {
  defaultPrice: number = 10;
  customPrices: { [date: string]: number } = {
    '2023-01-01': 15,
    '2023-01-05': 20,
    // Add more custom prices as needed
  };

  selectedMonth: number;
  selectedYear: number;

  // Initialize calendarDates with the days of the selected month
  calendarDates: { day: number; price: number; selected: boolean }[] = [];

  selectedRange: { start: number | null; end: number | null } = { start: null, end: null };

  constructor() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1; // Months are zero-based
    this.selectedYear = currentDate.getFullYear();
    this.generateCalendar();
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
    const firstDay = new Date(this.selectedYear, this.selectedMonth - 1, 1).getDay(); // 0-indexed
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

    this.calendarDates = [];

    // Fill in the days before the 1st day of the month with a placeholder
    for (let i = 0; i < firstDay; i++) {
      this.calendarDates.push({ day: 0, price: 0, selected: false });
    }

    // Fill in the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${this.selectedYear}-${this.selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      this.calendarDates.push({
        day,
        price: this.customPrices[dateKey] !== undefined ? this.customPrices[dateKey] : this.defaultPrice,
        selected: false,
      });
    }

    this.updateSelectedStyles();
  }


  // Change the selected month and update the calendar
  changeMonth(delta: number): void {
    this.selectedMonth += delta;
    if (this.selectedMonth === 0) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else if (this.selectedMonth === 13) {
      this.selectedMonth = 1;
      this.selectedYear++;
    }
    this.generateCalendar();
  }

  // Change the selected year and update the calendar
  changeYear(delta: number): void {
    this.selectedYear += delta;
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
      if (this.selectedRange.start !== null && (date.day === this.selectedRange.start || (this.selectedRange.end !== null && date.day > this.selectedRange.start && date.day <= this.selectedRange.end))) {
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
}
