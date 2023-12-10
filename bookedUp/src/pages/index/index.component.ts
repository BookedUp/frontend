import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../styles.css']
})

export class IndexComponent implements OnInit {
  
  startDate = new Date(2023, 11, 1);

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    var searchButton = document.getElementById("searchButton");
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        
        const roleParam = this.route.snapshot.queryParams['role'];

        if (roleParam === 'admin') {
          this.router.navigate(['/search'], { queryParams: { role: 'admin' } });
        } else if (roleParam === 'host') {
          this.router.navigate(['/search'], { queryParams: { role: 'host' } });
        } else if (roleParam === 'guest') {
          this.router.navigate(['/search'], { queryParams: { role: 'guest' } });
        } else {
          this.router.navigate(['/search']);
        }
      });
    }

  }
}
