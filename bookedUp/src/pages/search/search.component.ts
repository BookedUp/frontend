
import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../../app/core/services/accommodation.service';
import { Accommodation } from '../../app/core/model/Accommodation';
import { Amenity } from '../../app/core/model/Amenity';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css', '../../styles.css']
})
export class SearchComponent implements OnInit {
  isChecked: boolean = false;
  location: string = "";
  fromDate: Date = new Date();
  outDate: Date = new Date();
  guests: number = 0;
  selectedClass: string = 'all-wrapper1';
  customBudget: number = 50;
  searchResults: Accommodation[] = [];
  budgetCheckboxIds: string[] = [];
  popularCheckboxIds: Amenity[] = [];



  checkboxChanged(event: any, checkboxId: string) {
    console.log("hej");
    const isBudgetFilter = event.target.closest('#budget-filters') !== null;
    const isPopularFilter = event.target.closest('#popular-filters') !== null;
  
    if (isBudgetFilter) {
      // Očisti sve prethodno čekirane opcije
      this.budgetCheckboxIds = [];
  
      const idParts = checkboxId.split('-');
      const minPrice: number = parseFloat(idParts[0]);
      const maxPrice: number = parseFloat(idParts[1]);
  
      if (event.target.checked) {
        this.budgetCheckboxIds.push(`Min: ${minPrice}, Max: ${maxPrice}`);
      }
    } else if (isPopularFilter) {
      // Očisti sve prethodno čekirane opcije
      this.popularCheckboxIds = [];
  
      if (event.target.checked) {
        if (checkboxId in Amenity) {
          const amenity: Amenity = checkboxId as Amenity;
          this.popularCheckboxIds.push(amenity);;
        }
      }
    }
  
    // Provjerite ima li barem jedan čekirani checkbox prije poziva callFilterAccommodations
    if (this.budgetCheckboxIds.length > 0 || this.popularCheckboxIds.length > 0) {
      console.log('USAAAAAAAAAAAAAAAAAAAAAO');
      this.filterAccommodations();
    }
  }
  


  constructor(private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService) { }

  ngOnInit() {
    
    this.location = this.route.snapshot.queryParams['location'];
    this.fromDate = this.route.snapshot.queryParams['selectedFromDate'];
    this.outDate = this.route.snapshot.queryParams['selectedToDate'];
    this.guests = this.route.snapshot.queryParams['guestNumber'];
    this.searchResults = JSON.parse(this.route.snapshot.queryParams['searchResults']);

    

    const parsedFromDate = new Date(this.fromDate);
    const parsedToDate = new Date(this.outDate);

    if (!isNaN(parsedFromDate.getTime()) && !isNaN(parsedToDate.getTime())) {
      this.fromDate = parsedFromDate;
      this.outDate = parsedToDate;
    } else {
      console.error('Invalid date format detected. Check your query parameters.');
      return;
    }  
    var frameContainer19 = document.getElementById("frameContainer19");
    if (frameContainer19) {
      frameContainer19.addEventListener("click", () => {
          const roleParam = this.route.snapshot.queryParams['role'];

          if (roleParam === 'admin') {
            this.router.navigate(['/accommodation-details'], { queryParams: { role: 'admin' } });
          } else if (roleParam === 'host') {
            this.router.navigate(['/accommodation-details'], { queryParams: { role: 'host' } });
          } else if (roleParam === 'guest') {
            this.router.navigate(['/accommodation-details'], { queryParams: { role: 'guest' } });
          } else {
            this.router.navigate(['/accommodation-details']);
          }
        });
      }
    }
  
  
  updateBudget(): void {
    // Handle any additional logic when the budget is updated
    // For example, you can use this.customBudget in your search logic
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
  }

  calculateDayDifference(): number{
    const timeDifference = this.outDate.getTime() - this.fromDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference;
  }

  filterAccommodations() {
    let minPrice: number = 0.0;
    let maxPrice: number = 100000000000.0;

    if (this.budgetCheckboxIds.length > 0) {
      const idParts = this.budgetCheckboxIds[0].split(','); 
      minPrice = parseFloat(idParts[0].replace('Min:', '').trim());
      maxPrice = parseFloat(idParts[1].replace('Max:', '').trim());
    }

    console.log('Request Params:', this.searchResults);
    console.log(this.popularCheckboxIds);
    console.log(minPrice)
    console.log(maxPrice)
    this.accommodationService
      .searchAccommodations(this.location, this.guests, this.fromDate, this.outDate, this.popularCheckboxIds.length > 0 ? this.popularCheckboxIds : [], minPrice, maxPrice)
      .subscribe(
        (filterResults: Accommodation[]) => {
          console.log('Accommodations:', filterResults);
          this.searchResults = filterResults;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }



}




