import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../app/core/services/accommodation.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../styles.css']
})

export class IndexComponent implements OnInit {

  location: string = "";
  startDate = new Date();
  endDate = new Date();
  guestNumber :number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService) { }

    ngOnInit() {
        var searchButton = document.getElementById("searchButton");
        if (searchButton) {
            searchButton.addEventListener("click", () => {
                const roleParam = this.route.snapshot.queryParams['role'];


                this.location = (document.getElementById("locationTxt") as HTMLInputElement)?.value || "";
                this.startDate = new Date((document.getElementById("startDateTxt") as HTMLInputElement)?.value || '');
                this.endDate = new Date((document.getElementById("endDateTxt") as HTMLInputElement)?.value || '');
                this.guestNumber = parseInt((document.getElementById("guestNumberTxt") as HTMLInputElement)?.value || '0', 10);



                this.accommodationService.searchAccommodations(this.location, this.guestNumber, this.startDate, this.endDate)
                    .subscribe((results) => {
                        // Rad sa rezultatima pretrage, na primer, redirekcija na drugu rutu
                        if (roleParam === 'admin') {
                            this.router.navigate(['/search'], { queryParams: { role: 'admin', location: this.location } });
                        } else if (roleParam === 'host') {
                            this.router.navigate(['/search'], { queryParams: { role: 'host', location: this.location } });
                        } else if (roleParam === 'guest') {
                            this.router.navigate(['/search'], { queryParams: { role: 'guest', location: this.location } });
                        } else {
                            this.router.navigate(['/search'], { queryParams: { location: this.location } });
                        }
                    });
            });
        }
    }
}
