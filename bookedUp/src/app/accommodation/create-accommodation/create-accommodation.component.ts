import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-accommodation',
  templateUrl: './create-accommodation.component.html',
  styleUrls: ['./create-accommodation.component.css', '../../../styles.css']
})
export class CreateAccommodationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  saveAccommodation():void{

  }
}