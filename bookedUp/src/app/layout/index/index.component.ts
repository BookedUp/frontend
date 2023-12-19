import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../accommodation/accommodation.service';
import { Accommodation } from '../../accommodation/model/accommodation.model';
import {Observable, from} from "rxjs";
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {  FormGroup, FormBuilder, FormControl, Validators, NgForm, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../../styles.css']
})

export class IndexComponent implements OnInit {
    minFromDate: string | undefined;
    popularAccommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
    priceTypeGuest: string = '/per guest';
    priceTypeNight: string= '/per night';
    searchResults: Accommodation[] = [];
    searchForm!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, private accommodationService: AccommodationService, private authService: AuthService) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minFromDate = this.formatDate(tomorrow);
  }
  

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  ngOnInit() {
      this.popularAccommodations = this.accommodationService.getMostPopularAccommodations().pipe(
          map((accommodations: Accommodation[]) => accommodations.slice(0, 4))
        );
  }


  roundHalf(value: number): number {
      return Math.round(value * 2) / 2;
  }

  searchAccommodations() {

    let roleParam: string = '';
    this.authService.userState.subscribe((result) => {
        roleParam = result;
    })
  
    
      const location = (document.getElementById("locationTxt") as HTMLInputElement).value || "";
      const guestNumber = parseInt((document.getElementById("guestNumberTxt") as HTMLInputElement).value, 10) || 0;

      const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
      const selectedFromDateInputValue = fromDateInput.value;
      const selectedFromDate = selectedFromDateInputValue ? new Date(selectedFromDateInputValue) : new Date();


      const toDateInput = document.getElementById("toDate") as HTMLInputElement;
      const selectedToDateInputValue = toDateInput.value;
      const selectedToDate = selectedToDateInputValue ? new Date(selectedToDateInputValue) : new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedFromDate.setHours(0, 0, 0, 0);
      selectedToDate.setHours(0, 0, 0, 0);
      if (
        (selectedFromDate.getTime() === today.getTime() && selectedToDate.getTime() !== today.getTime()) ||
        (selectedFromDate.getTime() !== today.getTime() && selectedToDate.getTime() === today.getTime())
      ) {
        alert('Please enter both check-in and check-out dates.');
        return;
      }

      this.accommodationService.searchAccommodations(location, guestNumber, selectedFromDate, selectedToDate)
        .subscribe((results) => {
          this.searchResults = results;
          if (roleParam === 'ROLE_ADMIN') {
            this.router.navigate(['/search'], { queryParams: { location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
          } else if (roleParam === 'ROLE_HOST') {
            this.router.navigate(['/search'], { queryParams: { location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
          } else if (roleParam === 'ROLE_GUEST') {
            this.router.navigate(['/search'], { queryParams: { location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
          } else {
            this.router.navigate(['/search'], { queryParams: { location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
          }
        });
    

  }

    searchAccommodationsByCountry(country: string) {
        let roleParam: string = '';
        this.authService.userState.subscribe((result) => {
            roleParam = result;
        })

        //const location = (document.getElementById("locationTxt") as HTMLInputElement).value || "";
        const guestNumber = parseInt((document.getElementById("guestNumberTxt") as HTMLInputElement).value, 10) || 0;

        const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
        const selectedFromDateInputValue = fromDateInput.value;
        const selectedFromDate = selectedFromDateInputValue ? new Date(selectedFromDateInputValue) : new Date();


        const toDateInput = document.getElementById("toDate") as HTMLInputElement;
        const selectedToDateInputValue = toDateInput.value;
        const selectedToDate = selectedToDateInputValue ? new Date(selectedToDateInputValue) : new Date();

        

        this.accommodationService.searchAccommodations(country, guestNumber, selectedFromDate, selectedToDate)
            .subscribe((results) => {
                this.searchResults = results;
                if (roleParam === 'ROLE_ADMIN') {
                    this.router.navigate(['/search'], { queryParams: { location: country, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
                } else if (roleParam === 'ROLE_HOST') {
                    this.router.navigate(['/search'], { queryParams: { location: country, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
                } else if (roleParam === 'ROLE_GUEST') {
                    this.router.navigate(['/search'], { queryParams: { location: country, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
                } else {
                    this.router.navigate(['/search'], { queryParams: { location: country, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
                }
            });
    }
}
