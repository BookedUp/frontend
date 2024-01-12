import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { YearlyAnalyticsComponent } from '../yearly-analytics/yearly-analytics.component';
import jsPDF from 'jspdf';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit{
  @ViewChild(YearlyAnalyticsComponent) yearlyAnalyticsComponent: YearlyAnalyticsComponent | undefined;

  accommodations: string[] = [];
  selectedAccommodation: string = '';
  isDropdownVisible = false;

  types: string[] = ['All Accommodations', 'Single Accommodation'];
  selectedType: string = 'All Accommodations';
  isDropdownTypeVisible = false;

  hostName: string = '';

  startDate: string = '';
  startDateInput: Date | null = null;
  endDateInput: Date | null = null;
  endDate: string = '';
  
  constructor( private accommodationService: AccommodationService, private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {
    
    this.accommodationService.getAllActiveAccommodationsByHostId(this.authService.getUserID()).subscribe(
      (result) => {
        this.accommodations = result.map(acc => acc.name);
      },
      (error) => {
        console.error('Error fetching accommodations:', error);
      }
    );      

    this.userService.getUser(this.authService.getUserID()).subscribe(
      (result) => {
        this.hostName = `${result.firstName} ${result.lastName}`;
      },
      (error) => {
        console.error('Error fetching host name:', error);
      }
    );

    const endDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    this.endDate = this.formatDate(endDate);
    this.startDate = this.formatDate(oneYearAgo);
  }

  startDateChanged() {
    if(this.startDateInput != null){
      const fromDateInput = document.getElementById("startDate") as HTMLInputElement;
      const selectedFromDateInputValue = fromDateInput.value;
      const selectedFromDate = selectedFromDateInputValue ? new Date(selectedFromDateInputValue) : new Date();

      this.startDate = this.formatDate(selectedFromDate);

      if (this.endDateInput != null && this.startDateInput < this.endDateInput && this.yearlyAnalyticsComponent) {
  
        if (this.yearlyAnalyticsComponent) {
          this.yearlyAnalyticsComponent.startDate = this.startDate;
          this.yearlyAnalyticsComponent.endDate = this.endDate;
        }
      }
    }    
  }

  endDateChanged() {
    if (this.endDateInput != null) {
      const toDateInput = document.getElementById("endDate") as HTMLInputElement;
      const selectedToDateInputValue = toDateInput.value;
      const selectedToDate = selectedToDateInputValue ? new Date(selectedToDateInputValue) : new Date();

      this.endDate = this.formatDate(selectedToDate);

      if (this.startDateInput != null && this.startDateInput < this.endDateInput && this.yearlyAnalyticsComponent) {
        this.yearlyAnalyticsComponent.startDate = this.startDate;
        this.yearlyAnalyticsComponent.endDate = this.endDate;
        this.yearlyAnalyticsComponent.getAnalytics();
      }
    }
  }
  

  toggleDropdown() {
    this.isDropdownVisible = true;
  }

  selectAccommodation(name: string) {
    this.isDropdownVisible = false;
    this.selectedAccommodation = name;
  }

  toggleTypeDropdown() {
    this.isDropdownTypeVisible = true;
  }

  selectType(name: string) {
    this.isDropdownTypeVisible = false;
    this.selectedType = name;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  printingPDF() {
    if (!this.selectedType) {
        console.error('Selected type is required.');
        return;
    }

    // Title section
    const title = `Report - ${this.selectedType}${this.selectedType === 'Single Accommodation' ? ` - ${this.selectedAccommodation}` : ''}`;

    // Dates section
    const formattedStartDate = this.formatDatePDF(this.startDate);
    const formattedEndDate = this.formatDatePDF(this.endDate);
    const dateSection = `Dates: ${formattedStartDate} - ${formattedEndDate}`;

    // Host name section
    const hostNameSection = `Host Name: ${this.hostName}`;

    // Content for the PDF
    const content: Array<string> = [
        title,
        dateSection,
        hostNameSection,
        'Charts:',
    ];

    // Get the chart image or canvas from the app-yearly-analytics component
    if (this.yearlyAnalyticsComponent !== undefined) {
      const chartImages = this.yearlyAnalyticsComponent.generateChartImages();
    
      if (chartImages !== undefined) {
        content.push(`Profit Chart: ${chartImages.leftChart}`);
        content.push(`Reservations Chart: ${chartImages.rightChart}`);
      }
    }
    
    
    // Create PDF document
    const pdf = new jsPDF();

    // Set initial y-coordinate
    let yCoordinate = 10;

    // Add content to the PDF
    content.forEach(item => {
        pdf.setFontSize(12); // Set the font size as needed

        // If the item is a string, add it as text; otherwise, it's assumed to be an image
        if (typeof item === 'string') {
            pdf.text(item, 10, yCoordinate);
            yCoordinate += 10;
        } else {
            // Assuming item is an image
            pdf.addImage(item, 'PNG', 10, yCoordinate, 100, 50); // Adjust width and height as needed
            yCoordinate += 60; // Adjust the y-coordinate based on the height of the image
        }
    });

    // Save or download the PDF
    pdf.save('report.pdf');
}


  private formatDatePDF(dateString: string): string {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
}
