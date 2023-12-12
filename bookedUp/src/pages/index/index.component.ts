import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../app/core/services/accommodation.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../styles.css']
})

export class IndexComponent implements OnInit {


  constructor(private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService) { }

    ngOnInit() {
        var searchButton = document.getElementById("searchButton");
        if (searchButton) {
            searchButton.addEventListener("click", () => {
                const roleParam = this.route.snapshot.queryParams['role'];
                const location = document.getElementById("locationTxt") as HTMLInputElement;
                const guestNumber = document.getElementById("guestNumberTxt") as HTMLInputElement;
                
                const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
                const selectedFromDate = fromDateInput.value;
          
                const toDateInput = document.getElementById("toDate") as HTMLInputElement;
                const selectedToDate = toDateInput.value;


                this.accommodationService.searchAccommodations(location, selectedFromDate, selectedToDate, guestNumber)
                    .subscribe((results) => {
                        if (roleParam === 'admin') {
                            this.router.navigate(['/search'], { queryParams: { role: 'admin', location: location } });
                        } else if (roleParam === 'host') {
                            this.router.navigate(['/search'], { queryParams: { role: 'host', location: location } });
                        } else if (roleParam === 'guest') {
                            this.router.navigate(['/search'], { queryParams: { role: 'guest', location: location } });
                        } else {
                            this.router.navigate(['/search'], { queryParams: { location: location} });
                        }
                    });
            });
        }
    }
}
