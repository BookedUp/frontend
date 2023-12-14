import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../../app/core/services/accommodation.service';
import { Accommodation } from '../../app/core/model/Accommodation';
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
  selectedType: string = 'all';
  customBudget: number = 50;
  searchResults: Accommodation[] = [];
  budgetCheckboxIds: string[] = [];
  popularCheckboxIds: string[] = [];
  updateTimeout: any;
  budgetSliderDisabled: boolean = false;
  radioButtonsState: { [key: string]: boolean } = {};
  name: string = "";
  minFromDate: string;

  checkboxChanged(event: any, checkboxId: string) {
    console.log("hej");
    const isBudgetFilter = event.target.closest('#budget-filters') !== null;
    const isPopularFilter = event.target.closest('#popular-filters') !== null;

  
    if (isBudgetFilter) {
      this.budgetCheckboxIds = [];
  
      const idParts = checkboxId.split('-');
      const minPrice: number = parseFloat(idParts[0]);
      const maxPrice: number = parseFloat(idParts[1]);
  
      if (event.target.checked) {
        this.budgetCheckboxIds.push(`Min: ${minPrice}, Max: ${maxPrice}`);
      }
    } else if (isPopularFilter) {
      if (event.target.checked) {
          // Add the checkbox to the list only if it is not already present
          if (!this.popularCheckboxIds.includes(checkboxId)) {
            this.popularCheckboxIds.push(checkboxId);
          }
        
      } else {
        // Remove the checkbox from the list
        this.popularCheckboxIds = this.popularCheckboxIds.filter(
          checkbox => checkbox !== checkboxId
        );
      }
    }
    
    if (this.budgetCheckboxIds.length > 0 || this.popularCheckboxIds.length > 0) {
      this.searchAndFilterAccommodations();
    } else if (this.budgetCheckboxIds.length > 0 || this.popularCheckboxIds.length == 0) {
      this.searchAndFilterAccommodations();
    } else if (this.popularCheckboxIds.length > 0 || this.budgetCheckboxIds.length == 0){
      this.searchAndFilterAccommodations();
    }
  
  }

  onNameChange(newValue: string): void {
    this.name = newValue;
    this.searchAndFilterAccommodations();
  }

  constructor(private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService) { 
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

    
  onSearchClick(): void {
    this.location = (document.getElementById("locationTxt") as HTMLInputElement).value;
    this.guests = parseInt((document.getElementById("guestNumberTxt") as HTMLInputElement).value, 10);

    const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
    this.fromDate = new Date(fromDateInput.value);

    const toDateInput = document.getElementById("toDate") as HTMLInputElement;
    this.outDate = new Date(toDateInput.value);
    this.searchAndFilterAccommodations();
  }
  
  updateBudget(): void {
    
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = setTimeout(() => {
      
  
      this.searchAndFilterAccommodations();
    }, 500);
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  changeStyle(className: string): void {
    console.log(className)
    this.selectedType = className;
    this.searchAndFilterAccommodations();
  }

  calculateDayDifference(): number{
    const timeDifference = this.outDate.getTime() - this.fromDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference;
  }

  searchAndFilterAccommodations() {
    if (this.customBudget > 50) {
      this.budgetCheckboxIds = [];
    }
    let minPrice: number = 0.0;
    let maxPrice: number = 0.0;
    if (this.budgetCheckboxIds.length > 0) {
      const idParts = this.budgetCheckboxIds[0].split(','); 
      minPrice = parseFloat(idParts[0].replace('Min:', '').trim());
      maxPrice = parseFloat(idParts[1].replace('Max:', '').trim());
      if (Number.isNaN(maxPrice)){
        maxPrice = 100000.0;
      }
    } 
    

    console.log('Request Params:', this.searchResults);
    console.log(this.popularCheckboxIds);
    console.log(minPrice)
    console.log(maxPrice)
    this.accommodationService
      .searchAccommodations(this.location, this.guests, this.fromDate, this.outDate, this.popularCheckboxIds, minPrice, maxPrice, this.customBudget, this.selectedType, this.name)
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




