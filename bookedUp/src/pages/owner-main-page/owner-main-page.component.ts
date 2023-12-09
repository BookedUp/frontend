import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-main-page',
  templateUrl: './owner-main-page.component.html',
  styleUrls: ['./owner-main-page.component.css', '../../styles.css']
})
export class OwnerMainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var adminManage = document.getElementById("ownerManage");
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

    var manageProfile = document.getElementById("manageProfile");
      if (manageProfile) {
        manageProfile.addEventListener("click", () => {
          this.router.navigate(['/manage-profile']);
        });
      }
    
    var myAccommodations = document.getElementById("myAccommodations");
      if (myAccommodations) {
        myAccommodations.addEventListener("click", () => {
          this.router.navigate(['/accommodations']);
        });
      }

    var reservationRequests = document.getElementById("reservation-requests");
      if (reservationRequests) {
        reservationRequests.addEventListener("click", () => {
          this.router.navigate(['/reservation-requests']);
        });
      }

    var homeText = document.getElementById("homeText");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/owner-main-page']);
      });
    }
    
      
    var logOut = document.getElementById("logOut");
    if (logOut) {
      logOut.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    
  }
}
