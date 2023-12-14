import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../app/core/services/accommodation.service';
import { Accommodation } from '../../app/core/model/Accommodation';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../styles.css']
})

export class IndexComponent implements OnInit {
    popularAccommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();

  constructor(private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService) { }
  searchResults: any[] = [];


    ngOnInit() {

        this.popularAccommodations = this.accommodationService.getMostPopularAccommodations().pipe(
            map((accommodations: Accommodation[]) => accommodations.slice(0, 4))
          );

        console.log(this.popularAccommodations);
        var searchButton = document.getElementById("searchButton");
        if (searchButton) {
            searchButton.addEventListener("click", () => {
                const roleParam = this.route.snapshot.queryParams['role'];
                const location = (document.getElementById("locationTxt") as HTMLInputElement).value;
                const guestNumber = parseInt((document.getElementById("guestNumberTxt") as HTMLInputElement).value, 10);

                const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
                console.log("from date: ", fromDateInput);

                const selectedFromDate = new Date(fromDateInput.value);

                const toDateInput = document.getElementById("toDate") as HTMLInputElement;
                const selectedToDate = new Date(toDateInput.value);


                this.accommodationService.searchAccommodations(location, guestNumber, selectedFromDate, selectedToDate)
                    .subscribe((results) => {
                        this.searchResults = results;
                        if (roleParam === 'admin') {
                            this.router.navigate(['/search'], { queryParams: { role: 'admin', location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
                        } else if (roleParam === 'host') {
                            this.router.navigate(['/search'], { queryParams: { role: 'host', location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
                        } else if (roleParam === 'guest') {
                            this.router.navigate(['/search'], { queryParams: { role: 'guest', location: location, selectedFromDate: selectedFromDate, selectedToDate: selectedToDate, guestNumber, searchResults: JSON.stringify(results)} });
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
