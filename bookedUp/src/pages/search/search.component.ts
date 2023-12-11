
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css', '../../styles.css']
})
export class SearchComponent implements OnInit {
  isChecked: boolean = false;
  place: string = 'Melbourne';
  fromDate: Date = new Date();
  outDate: Date = new Date();
  guests: number = 0;
  selectedClass: string = 'all-wrapper1';
  customBudget: number = 50;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
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

}




