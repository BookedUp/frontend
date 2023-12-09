import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-accommodation',
  templateUrl: './create-accommodation.component.html',
  styleUrls: ['./create-accommodation.component.css', '../../styles.css']
})
export class CreateAccommodationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var adminManage = document.getElementById("ownerManage-create");
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

    var manageProfile = document.getElementById("manageProfile-create");
      if (manageProfile) {
        manageProfile.addEventListener("click", () => {
          this.router.navigate(['/manage-profile']);
        });
      }
    
    var myAccommodations = document.getElementById("myAccommodations-create");
      if (myAccommodations) {
        myAccommodations.addEventListener("click", () => {
          this.router.navigate(['/accommodations']);
        });
      }
      
    var reservationRequest = document.getElementById("reseervation-requests-create");
    if (reservationRequest) {
      reservationRequest.addEventListener("click", () => {
        this.router.navigate(['/reservation-requests']);
      });
    }

    var logOut = document.getElementById("logOut-create");
    if (logOut) {
      logOut.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var homeText = document.getElementById("homeText-create");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/owner-main-page']);
      });
    }
  }
}