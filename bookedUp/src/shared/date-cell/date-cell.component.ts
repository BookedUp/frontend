import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.css']
})
export class DateCellComponent {
  @Input() date: Date = new Date();
  @Input() priceDictionary: { [key: string]: number } = {};
  @Input() defaultValue: number = 0;

  getPrice(): string {
    const dateString = this.getDateString();
    return this.priceDictionary[dateString] !== undefined
      ? this.priceDictionary[dateString].toString()
      : this.defaultValue.toString();
  }

  getDateString(): string {
    // Customize the date formatting based on your requirements
    return this.date.toISOString().split('T')[0];
  }
}
