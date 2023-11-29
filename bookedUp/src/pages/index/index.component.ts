import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../styles.css']
})
export class IndexComponent implements OnInit {
  //bsConfig: Partial<BsDatepickerConfig> = {};

  isLocationInputVisible: boolean = false;
  enteredLocation: string = '';

  isGuestInputVisible: boolean = false;
  enteredGuests: number | undefined;


  isDateInputVisible: boolean = false;
  selectedDate!: Date;


  constructor(private router: Router) {}

  ngOnInit() {
    var frameContainer3 = document.getElementById("frameContainer3");
    if (frameContainer3) {
      frameContainer3.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }

    var frameContainer2 = document.getElementById("frameContainer2");
    if (frameContainer2) {
      frameContainer2.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }

    var frameContainer = document.getElementById("frameContainer");
    if (frameContainer) {
      frameContainer.addEventListener("click", () => {
        this.router.navigate(['/search']);
      });
    }

    var locationText = document.getElementById("locationText");
    if (locationText) {
      locationText.addEventListener("click", () => {
        this.isLocationInputVisible = true;
      });
    }

    var locationInput = document.getElementById("locationInput");
    if (locationInput) {
      locationInput.addEventListener("blur", () => {
        this.disableLocationInput();
      });
    }

    var guestsComponent = document.getElementById("guestsComponent");
    if (guestsComponent) {
      guestsComponent.addEventListener("click", () => {
        this.enableGuestInput();
      });
    }

    var guestsInput = document.getElementById("guestsInput");
    if (guestsInput) {
      guestsInput.addEventListener("blur", () => {
        this.disableGuestInput();
      });
    }
  }

  enableLocationInput() {
    this.isLocationInputVisible = true;
  }

  disableLocationInput() {
    this.isLocationInputVisible = false;

    if (this.enteredLocation.trim() === "") {
      this.enteredLocation = '';
    } else {
      console.log("Entered location:", this.enteredLocation);
    }
  }

  enableGuestInput() {
    this.isGuestInputVisible = true;
  }

  disableGuestInput() {
    this.isGuestInputVisible = false;

    if (this.enteredGuests === undefined || this.enteredGuests === null) {
      this.enteredGuests = undefined;
    } else {
      console.log("Entered number of guests:", this.enteredGuests);
    }
  }

  enableDateInput() {
    this.isDateInputVisible = true;
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.isDateInputVisible = false;
  }

  disableDateInput() {
    this.isDateInputVisible = false;
  }
}
