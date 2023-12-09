import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-requests',
  templateUrl: './reservation-requests.component.html',
  styleUrls: ['./reservation-requests.component.css', '../../styles.css']
})
export class ReservationRequestsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var adminManage = document.getElementById("ownerManage-reservation");
    if (adminManage) {
      adminManage.addEventListener("click", () => {
        var popup = document.getElementById("ownerDropdownContainer");
        var popupStyle = popup?.style;

        if (popupStyle) {
          popupStyle.display = "flex";
          popupStyle.zIndex = "100";
          popupStyle.backgroundColor = "rgba(113, 113, 113, 0.3)";
          popupStyle.alignItems = "center";
          popupStyle.justifyContent = "center";
        }

        popup?.setAttribute("closable", "");

        var onClick = (popup && popup.onclick) || function (e: Event) {
          if (e.target === popup && popup && popup.hasAttribute("closable")) {
            popup.style.display = "none";
          }
        };

        popup?.addEventListener("click", onClick);
      });
    }

    var manageProfile = document.getElementById("manageProfile-reservation");
      if (manageProfile) {
        manageProfile.addEventListener("click", () => {
          this.router.navigate(['/manage-profile']);
        });
      }
    
    var myAccommodations = document.getElementById("myAccommodations-reservation");
      if (myAccommodations) {
        myAccommodations.addEventListener("click", () => {
          this.router.navigate(['/accommodations']);
        });
    }

    var reservationRequests = document.getElementById("reservation-requests-reservation");
      if (reservationRequests) {
        reservationRequests.addEventListener("click", () => {
          this.router.navigate(['/accommodations']);
        });
    }
      
    var logOut = document.getElementById("logOut-reservation");
    if (logOut) {
      logOut.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var homeText = document.getElementById("homeText-reservation");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/owner-main-page']);
      });
    }
  }
}
