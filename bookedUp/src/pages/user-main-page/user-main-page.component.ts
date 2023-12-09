import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.css', '../../styles.css']
})
export class UserMainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    
  }
}
