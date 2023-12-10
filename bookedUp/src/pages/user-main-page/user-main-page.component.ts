import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.css', '../../styles.css']
})
export class UserMainPageComponent implements OnInit {
  userRole: string = '';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve the role from the query parameters
    this.route.queryParams.subscribe(params => {
      this.userRole = params['role'];
    });
  }
}

