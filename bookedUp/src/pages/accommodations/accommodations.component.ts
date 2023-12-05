import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css', '../../styles.css']
})
export class AccommodationsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var adminManage = document.getElementById("ownerManage-acc");
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

    var manageProfile = document.getElementById("manageProfile-acc");
      if (manageProfile) {
        manageProfile.addEventListener("click", () => {
          this.router.navigate(['/manage-profile']);
        });
      }
    
    var myAccommodations = document.getElementById("myAccommodations-acc");
      if (myAccommodations) {
        myAccommodations.addEventListener("click", () => {
          this.router.navigate(['/accommodations']);
        });
      }
      
    var logOut = document.getElementById("logOut-acc");
    if (logOut) {
      logOut.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var homeText = document.getElementById("homeText-acc");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/owner-main-page']);
      });
    }

    var accDetails = document.getElementById("accommodation-owner-details");
    if (accDetails) {
      accDetails.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var newAcc = document.getElementById("new-acc");
      if (newAcc) {
        newAcc.addEventListener("click", () => {
          this.router.navigate(['/add-new-accommodation']);
      });
    }
  }
}
