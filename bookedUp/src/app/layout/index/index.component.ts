import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../core/services/accommodation.service';
import { Accommodation } from '../../core/model/Accommodation';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../../styles.css']
})

export class IndexComponent implements OnInit {
    minFromDate: string | undefined;
    popularAccommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
    
  constructor(private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService, private authService: AuthService) { 
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minFromDate = this.formatDate(tomorrow);
  }
  searchResults: any[] = [];

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

        console.log(this.popularAccommodations);
        var searchButton = document.getElementById("searchButton");
        if (searchButton) {
            searchButton.addEventListener("click", () => {
                let roleParam: string = '';
                this.authService.userState.subscribe((result) => {
                    roleParam = result;
                  })
                const location = (document.getElementById("locationTxt") as HTMLInputElement).value || "";
                console.log(location)
                const guestNumber = parseInt((document.getElementById("guestNumberTxt") as HTMLInputElement).value, 10) || 0;
                console.log(guestNumber);
                

                const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
            
                const selectedFromDateInputValue = fromDateInput.value;
                const selectedFromDate = selectedFromDateInputValue ? new Date(selectedFromDateInputValue) : new Date();

                console.log("from date: ", selectedFromDate);

                const toDateInput = document.getElementById("toDate") as HTMLInputElement;

                const selectedToDateInputValue = toDateInput.value;
                const selectedToDate = selectedToDateInputValue ? new Date(selectedToDateInputValue) : new Date();
                console.log("To date " + selectedToDate)


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
            });
        }
    }

    roundHalf(value: number): number {
        return Math.round(value * 2) / 2;
    }

    navigateToDetails(id: number) {
        this.router.navigate(['/accommodation-details', id]);
    }
}
